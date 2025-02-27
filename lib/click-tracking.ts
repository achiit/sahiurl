import { getDoc, doc, setDoc, updateDoc, query, where, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Click, Link } from '@/types/database';
import { calculateClickRevenue, updateRevenue } from '@/lib/revenue-calculator';
import { v4 as uuidv4 } from 'uuid';
import { recordClick as legacyRecordClick } from "@/lib/firebase/links";

// Check if this is a unique click (by IP for a specific link)
async function isUniqueClick(linkId: string, ipAddress: string): Promise<boolean> {
  try {
    // Query for existing clicks from this IP on this link
    const clicksRef = collection(db, 'clicks');
    const q = query(
      clicksRef, 
      where('linkId', '==', linkId),
      where('ip', '==', ipAddress)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty; // If empty, it's a unique click
  } catch (error) {
    console.error('Error checking for unique click:', error);
    return false; // Default to non-unique if there's an error
  }
}

// Calculate a basic fraud score (0-100)
function calculateFraudScore(clickData: Partial<Click>): number {
  let score = 0;
  
  // Check for missing user agent
  if (!clickData.userAgent) score += 20;
  
  // Check for missing referer
  if (!clickData.referer) score += 10;
  
  // Check for known bot user agents
  const botPatterns = ['bot', 'crawler', 'spider', 'headless'];
  if (clickData.userAgent && botPatterns.some(pattern => 
    clickData.userAgent!.toLowerCase().includes(pattern))) {
    score += 50;
  }
  
  // Suspicious if IP is from a data center
  const dataCenterIPs = ['34.', '35.', '104.', '173.']; // Example Google Cloud IPs
  if (clickData.ip && dataCenterIPs.some(prefix => clickData.ip!.startsWith(prefix))) {
    score += 30;
  }
  
  return Math.min(score, 100);
}

// Record a click with all relevant data
export async function recordClick(
  linkId: string,
  clickData: {
    ip: string,
    userAgent: string,
    referer?: string,
    country?: string,
    city?: string,
    device?: string,
    browser?: string,
    os?: string,
  }
): Promise<string> {
  try {
    // First record in legacy system for backward compatibility
    await legacyRecordClick(linkId, clickData);
    
    // Then continue with our enhanced tracking
    // Get link data
    const linkRef = doc(db, 'links', linkId);
    const linkDoc = await getDoc(linkRef);
    
    if (!linkDoc.exists()) {
      throw new Error('Link not found');
    }
    
    const linkData = linkDoc.data() as Link;
    
    // Check if this is a unique click by IP
    const unique = await isUniqueClick(linkId, clickData.ip);
    
    // Calculate fraud score
    const fraudScore = calculateFraudScore(clickData);
    const isFlagged = fraudScore > 70;
    
    // Create click record
    const clickId = uuidv4();
    const clickRecord: Click = {
      id: clickId,
      linkId,
      userId: linkData.userId,
      timestamp: new Date(),
      ip: clickData.ip,
      userAgent: clickData.userAgent,
      referer: clickData.referer,
      country: clickData.country,
      city: clickData.city,
      device: clickData.device,
      browser: clickData.browser,
      os: clickData.os,
      earned: 0, // Will be updated after revenue calculation
      isUnique: unique,
      adInteractions: {
        impressions: 0,
        clicks: 0,
        earnings: 0
      },
      fraudScore,
      isFlagged,
      flagReason: isFlagged ? 'High fraud score' : undefined
    };
    
    // Save the click record
    await setDoc(doc(db, 'clicks', clickId), clickRecord);
    
    // If it's a unique and non-flagged click, calculate and update revenue
    if (unique && !isFlagged) {
      const revenue = await calculateClickRevenue(clickRecord, linkData);
      await updateRevenue(clickRecord, linkId, linkData.userId, revenue);
    }
    
    return clickId;
  } catch (error) {
    console.error('Error recording click:', error);
    throw error;
  }
}

// Update session data for a click
export async function updateClickSession(
  clickId: string,
  sessionData: {
    sessionDuration: number,
    pagesViewed: number,
    adImpressions?: number,
    adClicks?: number
  }
): Promise<void> {
  try {
    const clickRef = doc(db, 'clicks', clickId);
    const clickDoc = await getDoc(clickRef);
    
    if (!clickDoc.exists()) {
      throw new Error('Click not found');
    }
    
    const clickData = clickDoc.data() as Click;
    
    // Only update if this is a unique click
    if (!clickData.isUnique) return;
    
    // Update session info
    await updateDoc(clickRef, {
      sessionDuration: sessionData.sessionDuration,
      pagesViewed: sessionData.pagesViewed,
      'adInteractions.impressions': sessionData.adImpressions || 0,
      'adInteractions.clicks': sessionData.adClicks || 0
    });
    
    // If ad interactions changed, recalculate revenue
    if (sessionData.adImpressions || sessionData.adClicks) {
      const linkRef = doc(db, 'links', clickData.linkId);
      const linkDoc = await getDoc(linkRef);
      
      if (linkDoc.exists()) {
        const linkData = linkDoc.data() as Link;
        const updatedClick = {
          ...clickData,
          sessionDuration: sessionData.sessionDuration,
          pagesViewed: sessionData.pagesViewed,
          adInteractions: {
            impressions: sessionData.adImpressions || 0,
            clicks: sessionData.adClicks || 0,
            earnings: 0
          }
        };
        
        const newRevenue = await calculateClickRevenue(updatedClick, linkData);
        const revenueDiff = newRevenue - clickData.earned;
        
        if (revenueDiff > 0) {
          await updateRevenue(updatedClick, clickData.linkId, clickData.userId, revenueDiff);
        }
      }
    }
  } catch (error) {
    console.error('Error updating click session:', error);
    throw error;
  }
} 
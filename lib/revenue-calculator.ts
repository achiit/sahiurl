import { Click, Link, User } from "@/types/database";
import { db } from "@/lib/firebase/config";
import { doc, updateDoc, increment, getDoc } from "firebase/firestore";

// Base revenue rates (in dollars)
const BASE_RATES = {
  UNIQUE_VISITOR: 0.005,      // Base rate per unique visitor
  AD_IMPRESSION: 0.002,       // Rate per ad impression
  AD_CLICK: 0.05,             // Rate per ad click
  SESSION_MULTIPLIER: 0.001,  // Additional per second of session
};

// Country-based rate multipliers
const COUNTRY_MULTIPLIERS: Record<string, number> = {
  US: 1.5,    // United States
  CA: 1.3,    // Canada
  GB: 1.3,    // United Kingdom
  AU: 1.2,    // Australia
  DE: 1.2,    // Germany
  FR: 1.0,    // France
  JP: 1.0,    // Japan
  IN: 0.7,    // India
  BR: 0.6,    // Brazil
  // Default is 0.5 for unlisted countries
};

// Calculate revenue for a click
export async function calculateClickRevenue(click: Click, link: Link): Promise<number> {
  // Only calculate revenue for unique visitors
  if (!click.isUnique) return 0;
  
  // Base revenue for unique visitor
  let revenue = BASE_RATES.UNIQUE_VISITOR;
  
  // Apply country multiplier
  const countryMultiplier = click.country && COUNTRY_MULTIPLIERS[click.country] 
    ? COUNTRY_MULTIPLIERS[click.country] 
    : 0.5;
  revenue *= countryMultiplier;
  
  // Add ad impression revenue (actual impressions * rate)
  if (click.adInteractions?.impressions) {
    revenue += click.adInteractions.impressions * BASE_RATES.AD_IMPRESSION;
  }
  
  // Add ad click revenue
  if (click.adInteractions?.clicks) {
    revenue += click.adInteractions.clicks * BASE_RATES.AD_CLICK;
  }
  
  // Add session duration bonus
  if (click.sessionDuration) {
    revenue += Math.min(click.sessionDuration * BASE_RATES.SESSION_MULTIPLIER, 0.05);
  }
  
  // Fraud protection - reduce revenue if suspicious
  if (click.fraudScore > 0) {
    const fraudReduction = Math.min(click.fraudScore / 100, 1);
    revenue *= (1 - fraudReduction);
  }
  
  return revenue;
}

// Update revenue for user and link
export async function updateRevenue(
  click: Click, 
  linkId: string, 
  userId: string,
  revenue: number
): Promise<void> {
  try {
    // Get link doc reference
    const linkRef = doc(db, 'links', linkId);
    const linkDoc = await getDoc(linkRef);
    const linkData = linkDoc.data() as Link;
    
    // Calculate revenue split
    const publisherShare = revenue * (linkData.revenueShare.publisherRate / 100);
    const platformShare = revenue * (linkData.revenueShare.platformRate / 100);
    
    // Update link analytics
    await updateDoc(linkRef, {
      'analytics.earnings': increment(revenue),
      'analytics.clicks': increment(1),
      'analytics.uniqueVisitors': click.isUnique ? increment(1) : increment(0),
      'analytics.lastClickedAt': new Date(),
    });
    
    // Update publisher earnings
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      'finances.totalEarnings': increment(publisherShare),
      'finances.pendingBalance': increment(publisherShare),
      'finances.lifetimeClicks': increment(1),
      'finances.lifetimeUniqueVisitors': click.isUnique ? increment(1) : increment(0),
    });
    
    // Update platform earnings (to a special account)
    const platformRef = doc(db, 'systemAccounts', 'platform');
    await updateDoc(platformRef, {
      'totalRevenue': increment(revenue),
      'platformShare': increment(platformShare),
      'publisherPayouts': increment(publisherShare),
    });
    
    // Update click with earned amount
    const clickRef = doc(db, 'clicks', click.id);
    await updateDoc(clickRef, {
      earned: revenue,
    });
    
  } catch (error) {
    console.error('Error updating revenue:', error);
    throw error;
  }
} 
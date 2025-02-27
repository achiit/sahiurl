"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function PageTracker() {
  const searchParams = useSearchParams()
  const clickId = searchParams.get('clickId')
  const [sessionDuration, setSessionDuration] = useState(0)
  const [adImpressions, setAdImpressions] = useState(0)
  
  useEffect(() => {
    if (!clickId) return
    
    // Track session duration
    const startTime = Date.now()
    const trackingInterval = setInterval(() => {
      const currentDuration = Math.floor((Date.now() - startTime) / 1000)
      setSessionDuration(currentDuration)
      
      // Send update every 30 seconds
      if (currentDuration % 30 === 0) {
        updateSession(clickId, {
          sessionDuration: currentDuration,
          pagesViewed: 1,
          adImpressions
        })
      }
    }, 1000)
    
    // Track ad impressions
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setAdImpressions(prev => prev + 1)
        }
      })
    }, { threshold: 0.5 })
    
    // Observe all ad containers
    document.querySelectorAll('.ad-container').forEach(ad => {
      observer.observe(ad)
    })
    
    // Handle page unload
    const handleUnload = () => {
      updateSession(clickId, {
        sessionDuration: Math.floor((Date.now() - startTime) / 1000),
        pagesViewed: 1,
        adImpressions
      })
    }
    
    window.addEventListener('beforeunload', handleUnload)
    
    return () => {
      clearInterval(trackingInterval)
      observer.disconnect()
      window.removeEventListener('beforeunload', handleUnload)
      handleUnload() // Send final update
    }
  }, [clickId, adImpressions])
  
  // Function to track ad clicks
  const trackAdClick = (position: string) => {
    if (!clickId) return
    
    fetch('/api/tracking/adclick', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clickId,
        shortCode: searchParams.get('shortCode'),
        position,
        timestamp: Date.now(),
        sessionDuration,
        adImpressions,
        pagesViewed: 1
      })
    }).catch(err => console.error('Failed to track ad click:', err))
  }
  
  // Add to global window for use by ad scripts
  useEffect(() => {
    if (!clickId) return
    
    // @ts-ignore
    window.trackAdClick = trackAdClick
  }, [clickId, sessionDuration])
  
  async function updateSession(
    clickId: string, 
    data: { sessionDuration: number; pagesViewed: number; adImpressions: number }
  ) {
    try {
      await fetch('/api/tracking/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clickId, ...data })
      })
    } catch (error) {
      console.error('Failed to update session:', error)
    }
  }
  
  // Empty div, this is just for tracking
  return <div className="hidden" />
} 
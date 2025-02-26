/**
 * This file defines the database schema for the application.
 * It's not used directly by Firebase but serves as documentation.
 */

export interface FirestoreSchema {
  users: Record<string, User>;
  links: Record<string, Link>;
  clicks: Array<Click>;
  earnings: Array<Earning>;
  blogPosts: Record<string, BlogPost>;
  settings: Record<string, Setting>;
  subscriptions: Record<string, Subscription>;
  payments: Array<Payment>;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'admin' | 'superadmin';
  createdAt: Date;
  lastLoginAt: Date;
  subscription: {
    plan: 'free' | 'basic' | 'premium' | 'enterprise';
    status: 'active' | 'canceled' | 'expired';
    endsAt?: Date;
  };
  settings: {
    emailNotifications: boolean;
    defaultRedirectDelay: number;
  };
  stats: {
    totalLinks: number;
    totalClicks: number;
    totalEarnings: number;
  };
}

export interface Link {
  id: string;
  userId: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  status: 'active' | 'disabled' | 'expired';
  settings: {
    redirectDelay: number;
    password?: string;
    adEnabled: boolean;
    blogPages: number;
  };
  analytics: {
    clicks: number;
    uniqueVisitors: number;
    earnings: number;
    lastClickedAt?: Date;
  };
  campaign?: string;
  tags?: string[];
}

export interface Click {
  id: string;
  linkId: string;
  timestamp: Date;
  ip: string;
  userAgent: string;
  referer?: string;
  country?: string;
  city?: string;
  browser?: string;
  os?: string;
  device?: string;
  earned?: number;
}

export interface Earning {
  id: string;
  userId: string;
  linkId: string;
  amount: number;
  source: 'ad' | 'referral' | 'subscription';
  timestamp: Date;
  status: 'pending' | 'paid';
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published';
  tags: string[];
  featuredImage?: string;
  linkId?: string; // If blog post is associated with a specific link
}

export interface Setting {
  key: string;
  value: any;
  updatedAt: Date;
  description: string;
  category: 'system' | 'payment' | 'ads' | 'email';
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'canceled' | 'expired';
  startedAt: Date;
  endsAt: Date;
  renewalDate?: Date;
  paymentMethod: {
    type: 'card' | 'paypal';
    lastFour?: string;
  };
}

export interface Payment {
  id: string;
  userId: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: 'card' | 'paypal';
  timestamp: Date;
  description: string;
} 
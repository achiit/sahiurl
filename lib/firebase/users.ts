import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  limit, 
  serverTimestamp, 
  Timestamp, 
  increment 
} from "firebase/firestore";
import { db } from "./config";
import type { User } from "./database-schema";

export async function createUser(userId: string, data: Partial<User>): Promise<User> {
  const userRef = doc(db, "users", userId);
  
  const newUser: Omit<User, 'uid'> = {
    email: data.email || "",
    displayName: data.displayName || "",
    photoURL: data.photoURL,
    role: data.role || "user",
    createdAt: new Date(),
    lastLoginAt: new Date(),
    subscription: {
      plan: "free",
      status: "active",
    },
    settings: {
      emailNotifications: true,
      defaultRedirectDelay: 10,
    },
    stats: {
      totalLinks: 0,
      totalClicks: 0,
      totalEarnings: 0,
      balance: 0
    },
  };
  
  await setDoc(userRef, {
    ...newUser,
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  });
  
  return {
    uid: userId,
    ...newUser,
  };
}

export async function getUser(userId: string): Promise<User | null> {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    return null;
  }
  
  const userData = userDoc.data() as Omit<User, 'uid'>;
  
  return {
    uid: userId,
    ...userData,
    createdAt: userData.createdAt instanceof Timestamp ? userData.createdAt.toDate() : new Date(userData.createdAt),
    lastLoginAt: userData.lastLoginAt instanceof Timestamp ? userData.lastLoginAt.toDate() : new Date(userData.lastLoginAt),
    subscription: userData.subscription || {
      plan: 'free',
      status: 'active',
      endsAt: undefined
    },
  };
}

export async function updateUser(userId: string, data: Partial<User>): Promise<void> {
  const userRef = doc(db, "users", userId);
  
  // Remove any fields that should not be updated directly
  const { uid, createdAt, ...updateData } = data;
  
  await updateDoc(userRef, {
    ...updateData,
    updatedAt: serverTimestamp(),
  });
}

export async function updateUserStats(userId: string, stats: {
  links?: number;
  clicks?: number;
  earnings?: number;
}): Promise<void> {
  const userRef = doc(db, "users", userId);
  
  const updates: Record<string, any> = {};
  
  if (stats.links !== undefined) {
    updates["stats.totalLinks"] = increment(stats.links);
  }
  
  if (stats.clicks !== undefined) {
    updates["stats.totalClicks"] = increment(stats.clicks);
  }
  
  if (stats.earnings !== undefined) {
    updates["stats.totalEarnings"] = increment(stats.earnings);
  }
  
  await updateDoc(userRef, updates);
}

export async function getAllUsers(options: {
  role?: 'user' | 'admin' | 'superadmin';
  limit?: number;
  orderBy?: 'createdAt' | 'lastLoginAt';
  orderDir?: 'asc' | 'desc';
} = {}): Promise<User[]> {
  let usersQuery = collection(db, "users");
  let constraints = [];
  
  if (options.role) {
    constraints.push(where("role", "==", options.role));
  }
  
  if (options.orderBy) {
    constraints.push(orderBy(options.orderBy, options.orderDir || 'desc'));
  }
  
  if (options.limit) {
    constraints.push(limit(options.limit));
  }
  
  const q = query(usersQuery, ...constraints);
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data() as Omit<User, 'uid'>;
    return {
      uid: doc.id,
      ...data,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
      lastLoginAt: data.lastLoginAt instanceof Timestamp ? data.lastLoginAt.toDate() : new Date(data.lastLoginAt),
      subscription: data.subscription || {
        plan: 'free',
        status: 'active',
        endsAt: undefined
      },
    };
  });
}

export async function listUsers(): Promise<User[]> {
  const q = query(collection(db, "users"))
  const querySnapshot = await getDocs(q)
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data()
    return {
      uid: doc.id,
      ...data,
      subscription: data.subscription || {
        plan: 'free',
        status: 'active',
        endsAt: undefined
      },
      createdAt: data.createdAt.toDate(),
      lastLoginAt: data.lastLoginAt.toDate(),
    } as User
  })
} 
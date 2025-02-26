import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp, 
  Timestamp 
} from "firebase/firestore";
import { db } from "./config";
import type { BlogPost } from "./database-schema";

export async function createBlogPost(data: Omit<BlogPost, 'id' | 'publishedAt' | 'updatedAt' | 'status'> & { 
  status?: 'draft' | 'published' 
}): Promise<BlogPost> {
  const now = new Date();
  
  const blogPost: Omit<BlogPost, 'id'> = {
    ...data,
    publishedAt: data.status === 'published' ? now : null,
    updatedAt: now,
    status: data.status || 'draft',
  };
  
  const docRef = await addDoc(collection(db, "blogPosts"), {
    ...blogPost,
    publishedAt: blogPost.publishedAt ? serverTimestamp() : null,
    updatedAt: serverTimestamp(),
  });
  
  return {
    id: docRef.id,
    ...blogPost,
  };
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  const blogRef = doc(db, "blogPosts", id);
  const blogDoc = await getDoc(blogRef);
  
  if (!blogDoc.exists()) {
    return null;
  }
  
  const data = blogDoc.data() as Omit<BlogPost, 'id'>;
  
  return {
    id: blogDoc.id,
    ...data,
    publishedAt: data.publishedAt instanceof Timestamp ? data.publishedAt.toDate() : data.publishedAt ? new Date(data.publishedAt) : null,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
  };
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const blogsRef = collection(db, "blogPosts");
  const q = query(blogsRef, where("slug", "==", slug), limit(1));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  const doc = querySnapshot.docs[0];
  const data = doc.data() as Omit<BlogPost, 'id'>;
  
  return {
    id: doc.id,
    ...data,
    publishedAt: data.publishedAt instanceof Timestamp ? data.publishedAt.toDate() : data.publishedAt ? new Date(data.publishedAt) : null,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
  };
}

export async function updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
  const blogRef = doc(db, "blogPosts", id);
  const blogDoc = await getDoc(blogRef);
  
  if (!blogDoc.exists()) {
    throw new Error("Blog post not found");
  }
  
  const { id: blogId, publishedAt, ...validUpdates } = updates;
  const updateData = {
    ...validUpdates,
    updatedAt: serverTimestamp(),
  };
  
  // If we're publishing a draft for the first time
  if (updates.status === 'published' && blogDoc.data().status === 'draft') {
    updateData.publishedAt = serverTimestamp();
  }
  
  await updateDoc(blogRef, updateData);
  
  return await getBlogPost(id) as BlogPost;
}

export async function deleteBlogPost(id: string): Promise<void> {
  const blogRef = doc(db, "blogPosts", id);
  await deleteDoc(blogRef);
}

export async function getAllBlogPosts(options: {
  status?: 'draft' | 'published';
  limit?: number;
  tag?: string;
  orderBy?: 'publishedAt' | 'updatedAt';
  orderDir?: 'asc' | 'desc';
} = {}): Promise<BlogPost[]> {
  const blogsRef = collection(db, "blogPosts");
  let constraints = [];
  
  if (options.status) {
    constraints.push(where("status", "==", options.status));
  }
  
  if (options.tag) {
    constraints.push(where("tags", "array-contains", options.tag));
  }
  
  if (options.orderBy) {
    constraints.push(orderBy(options.orderBy, options.orderDir || 'desc'));
  } else {
    constraints.push(orderBy("publishedAt", "desc"));
  }
  
  if (options.limit) {
    constraints.push(limit(options.limit));
  }
  
  const q = query(blogsRef, ...constraints);
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data() as Omit<BlogPost, 'id'>;
    return {
      id: doc.id,
      ...data,
      publishedAt: data.publishedAt instanceof Timestamp ? data.publishedAt.toDate() : data.publishedAt ? new Date(data.publishedAt) : null,
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
    };
  });
} 
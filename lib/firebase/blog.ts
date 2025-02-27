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
  Timestamp,
  DocumentSnapshot
} from "firebase/firestore";
import { db } from "./config";
import type { BlogPost } from "./database-schema";

export async function createBlogPost(post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): Promise<BlogPost> {
  const now = new Date()
  const postRef = await addDoc(collection(db, "blog_posts"), {
    ...post,
    status: post.status || 'draft',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt: post.status === 'published' ? serverTimestamp() : null
  })

  const doc = await getDoc(postRef)
  return convertToBlogPost(doc)
}

function convertToBlogPost(doc: DocumentSnapshot): BlogPost {
  const data = doc.data()!
  return {
    id: doc.id,
    title: data.title,
    slug: data.slug,
    content: data.content,
    excerpt: data.excerpt,
    author: data.author,
    status: data.status,
    tags: data.tags || [],
    featuredImage: data.featuredImage,
    linkId: data.linkId,
    createdAt: (data.createdAt as Timestamp).toDate(),
    updatedAt: (data.updatedAt as Timestamp).toDate(),
    publishedAt: data.publishedAt instanceof Timestamp ? data.publishedAt.toDate() : data.publishedAt ? new Date(data.publishedAt) : undefined
  }
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
    publishedAt: data.publishedAt instanceof Timestamp 
      ? data.publishedAt.toDate() 
      : data.publishedAt 
        ? new Date(data.publishedAt) 
        : undefined,
    updatedAt: data.updatedAt instanceof Timestamp 
      ? data.updatedAt.toDate() 
      : new Date(data.updatedAt),
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
    publishedAt: data.publishedAt instanceof Timestamp 
      ? data.publishedAt.toDate() 
      : data.publishedAt 
        ? new Date(data.publishedAt) 
        : undefined,
    updatedAt: data.updatedAt instanceof Timestamp 
      ? data.updatedAt.toDate() 
      : new Date(data.updatedAt),
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
    (updateData as any).publishedAt = serverTimestamp();
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
      publishedAt: data.publishedAt instanceof Timestamp 
        ? data.publishedAt.toDate() 
        : data.publishedAt 
          ? new Date(data.publishedAt) 
          : undefined,
      updatedAt: data.updatedAt instanceof Timestamp 
        ? data.updatedAt.toDate() 
        : new Date(data.updatedAt),
    };
  });
}

export async function listBlogPosts(): Promise<BlogPost[]> {
  const q = query(collection(db, "blogPosts"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      publishedAt: data.publishedAt instanceof Timestamp 
        ? data.publishedAt.toDate() 
        : data.publishedAt 
          ? new Date(data.publishedAt)
          : undefined,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
    } as BlogPost;
  });
}

export async function publishBlogPost(postId: string): Promise<void> {
  const postRef = doc(db, "blog_posts", postId)
  await updateDoc(postRef, {
    status: 'published',
    publishedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
} 
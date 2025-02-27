"use client"

import { useEffect, useState } from "react";
import type { BlogPost } from "@/types/blog"

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);

    useEffect(() => {
        // Fetch blog posts from your API
        const fetchPosts = async () => {
            const response = await fetch("/api/blog");
            const data = await response.json();
            setPosts(data.posts);
        };
        fetchPosts();
    }, []);

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold">Blog</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post: BlogPost) => (
                    <div key={post.id} className="border p-4 rounded">
                        <h2 className="text-xl">{post.title}</h2>
                        <p>{post.excerpt}</p>
                        <a href={`/blog/${post.id}`} className="text-blue-500">Read more</a>
                    </div>
                ))}
            </div>
        </div>
    );
} 
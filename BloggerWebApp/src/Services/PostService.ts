import { Post, PostPreview } from "../Models/Post";

const API_URL = import.meta.env.VITE_API_URL;
const POSTS_ENDPOINT = `${API_URL}/posts`;

export const fetchPosts = async (): Promise<PostPreview[]> => {
  console.log("Fetching from:", POSTS_ENDPOINT);
  try {
    const response = await fetch(POSTS_ENDPOINT);
    console.log("Response status:", response.status);
    if (!response.ok) throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
    return response.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const fetchPostById = async (id: number): Promise<Post> => {
  try {
    const response = await fetch(`${POSTS_ENDPOINT}/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch post: ${response.status} ${response.statusText}`);
    return response.json();
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};

export const addPost = async (newPost: Omit<Post, "id" | "createdDate" | "lastModifiedDate">): Promise<Post> => {
  try {
    const response = await fetch(POSTS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add post: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error("Error adding post:", error);
    throw error;
  }
};

export const updatePost = async (updatedPost: Post): Promise<Post> => {
  try {
    const response = await fetch(`${POSTS_ENDPOINT}/${updatedPost.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPost),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update post: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

export const deletePost = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${POSTS_ENDPOINT}/${id}`, { method: "DELETE" });
    
    if (!response.ok) {
      throw new Error(`Failed to delete post: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};
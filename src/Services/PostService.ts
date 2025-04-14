import { Post } from "../Models/Post";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
    throw new Error("API_URL not defined in .env");
  }
export const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Failed to fetch posts");
  return response.json();
};

export const addPost = async (newPost: Omit<Post, "id" | "createdDate" | "lastModifiedDate">): Promise<Post> => {
  const now = new Date().toISOString();
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...newPost, createdDate: now, lastModifiedDate: now }),
  });
  return response.json();
};

export const updatePost = async (updatedPost: Post): Promise<Post> => {
  const now = new Date().toISOString();
  const response = await fetch(`${API_URL}/${updatedPost.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...updatedPost, lastModifiedDate: now }),
  });
  return response.json();
};

export const deletePost = async (id: number): Promise<void> => {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};

import { useState } from "react";
import { usePosts } from "./Queries/usePosts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Post } from "./Models/Post";
import { PostList } from "./Components/PostList";
import { PostForm } from "./Components/PostForm";
import { Button } from "@mui/material";
import { addPost, updatePost, deletePost } from "./Services/PostService";

function App() {
  const { posts = [], loading } = usePosts();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const addPostMutation = useMutation({
    mutationFn: (newPost: Omit<Post, "id" | "createdDate" | "lastModifiedDate">) => addPost(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setOpen(false);
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: (updatedPost: Post) => updatePost(updatedPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setOpen(false);
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleAddPost = (newPost: Omit<Post, "id" | "createdDate" | "lastModifiedDate">) => {
    addPostMutation.mutate(newPost);
  };

  const handleUpdatePost = (updatedPost: Post) => {
    updatePostMutation.mutate(updatedPost);
  };

  const handleDeletePost = (id: number) => {
    deletePostMutation.mutate(id);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Add Post
      </Button>
      <PostList posts={posts} onEdit={setSelectedPost} onDelete={handleDeletePost} />
      <PostForm
        open={open}
        post={selectedPost}
        onClose={() => {
          setOpen(false);
          setSelectedPost(null);
        }}
        onSubmit={selectedPost ? handleUpdatePost : handleAddPost}
      />
    </div>
  );
}

export default App;

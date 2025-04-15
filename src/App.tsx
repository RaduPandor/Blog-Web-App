import { useState } from "react";
import { usePosts } from "./Queries/usePosts";
import { usePostMutations } from "./Queries/usePostMutations";
import { Post } from "./Models/Post";
import { PostList } from "./Components/PostList";
import { PostForm } from "./Components/PostForm";
import { Button } from "@mui/material";

function App() {
  const { posts = [], loading } = usePosts();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [open, setOpen] = useState(false);

  const { addPostMutation, updatePostMutation, deletePostMutation } = usePostMutations(() => {
    setOpen(false);
    setSelectedPost(null);
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

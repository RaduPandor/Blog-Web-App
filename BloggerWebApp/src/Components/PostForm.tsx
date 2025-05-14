import { useState, useEffect } from "react";
import { Post } from "../Models/Post";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

type PostFormProps<T> = {
  open: boolean;
  post: Post | null;
  onClose: () => void;
  onSubmit: (post: T) => void;
};

export function PostForm<T>({ open, post, onClose, onSubmit }: PostFormProps<T>) {
  const [newPost, setNewPost] = useState({
    title: "",
    author: "",
    content: "",
  });

  useEffect(() => {
    if (post) {
      setNewPost({
        title: post.title,
        author: post.author,
        content: post.content,
      });
    } else {
      setNewPost({ title: "", author: "", content: "" });
    }
  }, [post, open]);

  const handleSubmit = () => {
    if (!newPost.title || !newPost.author || !newPost.content) return;

    if (post) {
      const updatedPost = {
        ...post,
        title: newPost.title,
        author: newPost.author,
        content: newPost.content,
      } as unknown as T;
      onSubmit(updatedPost);
    } else {
      onSubmit(newPost as unknown as T);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{post ? "Edit Post" : "Add New Post"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          fullWidth
          margin="dense"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
        <TextField
          label="Author"
          fullWidth
          margin="dense"
          value={newPost.author}
          onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
        />
        <TextField
          label="Content"
          fullWidth
          multiline
          rows={4}
          margin="dense"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          {post ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
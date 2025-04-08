import { useState, useEffect } from "react";
import { Post } from "../Models/Post";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

type PostFormProps = {
  open: boolean;
  post: Post | null;
  onClose: () => void;
  onSubmit: (post: Post) => void;
};

export const PostForm = ({ open, post, onClose, onSubmit }: PostFormProps) => {
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
    }
  }, [post]);

  const handleSubmit = () => {
    if (!newPost.title || !newPost.author || !newPost.content) return;
  
    const postToSubmit = {
      ...newPost,
      id: post?.id || Date.now(),
      createdDate: post ? post.createdDate : "",
      lastModifiedDate: post ? post.lastModifiedDate : "",
    };
  
    onSubmit(postToSubmit);
    onClose();
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
};

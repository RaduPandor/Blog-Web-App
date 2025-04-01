import { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField
} from "@mui/material";

const API_URL = "http://localhost:5013/api/posts";

type Post = {
  id: number;
  title: string;
  author: string;
  content: string;
  createdDate: string;
  lastModifiedDate: string;
};

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ title: "", author: "", content: "" });
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setPosts(data));
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditingPost(null);
  };

  const handleAddOrUpdatePost = async () => {
    if (!newPost.title || !newPost.author || !newPost.content) return;
    const now = new Date().toISOString();

    if (editingPost) {
      await fetch(`${API_URL}/${editingPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editingPost, ...newPost, lastModifiedDate: now }),
      });

      const updatedPosts = posts.map((post) =>
        post.id === editingPost.id ? { ...post, ...newPost, lastModifiedDate: now } : post
      );
      setPosts(updatedPosts);
    } else {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newPost, createdDate: now, lastModifiedDate: now }),
      });

      const addedPost = await response.json();
      setPosts([...posts, addedPost]);
    }

    setNewPost({ title: "", author: "", content: "" });
    handleClose();
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setNewPost({ title: post.title, author: post.author, content: post.content });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setPosts(posts.filter((post) => post.id !== id));
  };

  return (
    <div style={{ padding: "20px" }}>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Post
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingPost ? "Edit Post" : "Add New Post"}</DialogTitle>
        <DialogContent>
          <TextField label="Title" fullWidth margin="dense" value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <TextField label="Author" fullWidth margin="dense" value={newPost.author}
            onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
          />
          <TextField label="Content" fullWidth multiline rows={4} margin="dense" value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleAddOrUpdatePost} color="primary">
            {editingPost ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Last Modified Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.id}</TableCell>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.author}</TableCell>
                <TableCell>{post.content}</TableCell>
                <TableCell>{post.createdDate}</TableCell>
                <TableCell>{post.lastModifiedDate}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(post)}>Edit</Button>
                  <Button onClick={() => handleDelete(post.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;

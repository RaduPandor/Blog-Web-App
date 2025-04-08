import { Post } from "../Models/Post";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

type PostListProps = {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
};

export const PostList = ({ posts, onEdit, onDelete }: PostListProps) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  const handleDeleteClick = (post: Post) => {
    setPostToDelete(post);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (postToDelete) {
      onDelete(postToDelete.id);
      setOpenDeleteDialog(false);
      setPostToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setPostToDelete(null);
  };

  return (
    <div>
      <TableContainer component={Paper}>
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
                  <Button onClick={() => onEdit(post)}>Edit</Button>
                  <Button onClick={() => handleDeleteClick(post)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDeleteDialog} onClose={handleDeleteCancel}>
        <DialogTitle>Are you sure you want to delete this post?</DialogTitle>
        <DialogContent>
          <p>Once deleted, this action cannot be undone.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

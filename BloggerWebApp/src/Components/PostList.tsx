import { PostPreview } from "../Models/Post";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

type PostListProps = {
  posts: PostPreview[];
  onView: (postId: number) => void;
  onEdit: (postId: number) => void;
  onDelete: (id: number) => void;
};

const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())){
      return dateString;
    } 

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

export const PostList = ({ posts, onView, onEdit, onDelete }: PostListProps) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<PostPreview | null>(null);

  const handleDeleteClick = (post: PostPreview) => {
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
              <TableCell>Content Preview</TableCell>
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
                <TableCell>{post.contentPreview}</TableCell>
                <TableCell>{formatDateForDisplay(post.createdDate)}</TableCell>
                <TableCell>{formatDateForDisplay(post.lastModifiedDate)}</TableCell>
                <TableCell>
                  <Button onClick={() => onView(post.id)}>View</Button>
                  <Button onClick={() => onEdit(post.id)}>Edit</Button>
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
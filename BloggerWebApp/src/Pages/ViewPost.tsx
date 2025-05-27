import { useParams, useNavigate } from "react-router-dom";
import { Button, Container, Typography, Box, CircularProgress, Paper, Alert,
   Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { usePost } from "../Queries/usePost";
import { useCurrentUser } from "../Queries/useCurrentUser";
import { usePostMutations } from "../Queries/usePostMutations";
import { useState } from "react";

function ViewPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const postId = id ? parseInt(id) : null;
  const { post, loading, error } = usePost(postId);
  const { data: currentUser } = useCurrentUser();
  const { deletePostMutation, errorMessage } = usePostMutations(() => {
    navigate("/");
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleBack = () => navigate("/");
  const handleEdit = () => {
    if (postId !== null) navigate(`/post/${postId}/edit`);
  };
  const handleDeleteClick = () => setOpenDeleteDialog(true);
  const handleDeleteConfirm = () => {
    setOpenDeleteDialog(false);
    if (postId !== null) {
      deletePostMutation.mutate(postId, {
        onSuccess: () => {
          navigate("/");
        },
      });
    }
  };
  const handleDeleteCancel = () => setOpenDeleteDialog(false);

  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box display="flex" justifyContent="center" padding={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container maxWidth="md">
        <Box padding={4}>
          <Typography color="error" variant="h5" gutterBottom>
            Error loading post
          </Typography>
          <Button onClick={handleBack} variant="contained">
            Back to Posts
          </Button>
        </Box>
      </Container>
    );
  }

  const isAuthorOrAdmin =
    currentUser?.id === post.authorId || currentUser?.roles?.includes("Admin");

  return (
    <Container maxWidth="md">
      <Box
        py={4}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Button onClick={handleBack} variant="outlined">
          Back to Posts
        </Button>

        {isAuthorOrAdmin && (
          <Box display="flex" gap={2}>
            <Button onClick={handleEdit} variant="contained" color="primary">
              Edit Post
            </Button>
            <Button onClick={handleDeleteClick} variant="outlined" color="error">
              Delete Post
            </Button>
          </Box>
        )}
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {post.title}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          By {post.author}
        </Typography>

        <Typography variant="caption" display="block" gutterBottom>
          Created: {formatDateForDisplay(post.createdDate)} | Last modified:{" "}
          {formatDateForDisplay(post.lastModifiedDate)}
        </Typography>

        <Box mt={3}>
          <Typography
            variant="body1"
            sx={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
          >
            {post.content}
          </Typography>
        </Box>

        {errorMessage && (
          <Box mt={3}>
            <Alert severity="error">{errorMessage}</Alert>
          </Box>
        )}
      </Paper>

      <Dialog open={openDeleteDialog} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ViewPost;
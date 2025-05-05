import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, Box, CircularProgress } from "@mui/material";
import { usePost } from "../Queries/usePost";

type PostViewDialogProps = {
  open: boolean;
  postId: number | null;
  onClose: () => void;
  onEdit: (postId: number) => void;
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

export const PostViewDialog = ({ open, postId, onClose, onEdit }: PostViewDialogProps) => {
  const { post, loading, error } = usePost(postId);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {loading ? "Loading..." : post?.title}
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" padding={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">Failed to load post</Typography>
        ) : post ? (
          <>
            <Typography variant="subtitle1" gutterBottom>
              By {post.author}
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
              Created: {formatDateForDisplay(post.createdDate)}
              {' | '}
              Last modified: {formatDateForDisplay(post.lastModifiedDate)}
            </Typography>
            <Box mt={2}>
              <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                {post.content}
              </Typography>
            </Box>
          </>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
        {post && (
          <Button onClick={() => onEdit(post.id)} color="primary">
            Edit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
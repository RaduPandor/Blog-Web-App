import { useParams, useNavigate } from "react-router-dom";
import { usePost } from "../Queries/usePost";
import { Button, Container, Typography, Box, CircularProgress, Paper } from "@mui/material";

function ViewPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const postId = id ? parseInt(id) : null;
  const { post, loading, error } = usePost(postId);

  const handleBack = () => {
    navigate('/');
  };

  const handleEdit = () => {
    if (postId !== null) {
      navigate(`/post/${postId}/edit`);
    }
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

  return (
    <Container maxWidth="md">
      <Box py={4}>
        <Button onClick={handleBack} variant="outlined" sx={{ mb: 2 }}>
          Back to Posts
        </Button>
        
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            {post.title}
          </Typography>
          
          <Typography variant="subtitle1" gutterBottom>
            By {post.author}
          </Typography>
          
          <Typography variant="caption" display="block" gutterBottom>
            Created: {formatDateForDisplay(post.createdDate)}
            {' | '}
            Last modified: {formatDateForDisplay(post.lastModifiedDate)}
          </Typography>
          
          <Box mt={3}>
            <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
              {post.content}
            </Typography>
          </Box>
          
          <Box mt={3}>
            <Button 
              onClick={handleEdit} 
              variant="contained" 
              color="primary"
            >
              Edit Post
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default ViewPost;
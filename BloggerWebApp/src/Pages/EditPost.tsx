import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePost } from "../Queries/usePost";
import { usePostMutations } from "../Queries/usePostMutations";
import { Post } from "../Models/Post";
import { Button, Container, Typography, Box, TextField, Paper, CircularProgress } from "@mui/material";

interface FormData {
  title: string;
  content: string;
}

function EditPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const postId = id ? parseInt(id) : null;
  
  const { post, loading, error } = usePost(postId);
  const { updatePostMutation, errorMessage } = usePostMutations();
  
  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: ""
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content
      });
    }
  }, [post]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !post) {
      return;
    }
    
    const updatedPost: Post = {
      ...post,
      title: formData.title,
      content: formData.content
    };
    
    updatePostMutation.mutate(updatedPost, {
      onSuccess: () => {
        if (postId !== null) {
          navigate(`/post/${postId}`);
        }
      }
    });
  };

  const handleCancel = () => {
    if (postId !== null) {
      navigate(`/post/${postId}`);
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
          <Button onClick={() => navigate('/')} variant="contained">
            Back to Posts
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box py={4}>
        <Typography variant="h4" gutterBottom>Edit Post</Typography>
        
        <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          
          <TextField
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            fullWidth
            multiline
            rows={20}
            margin="normal"
            required
          />
          
          {errorMessage && (
            <Box mt={2} p={2} bgcolor="#ffe6e6" borderRadius={1}>
              <Typography color="error">
                <strong>Error:</strong> {errorMessage}
              </Typography>
            </Box>
          )}
          
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button 
              onClick={handleCancel} 
              variant="outlined"
            >
              Cancel
            </Button>
            
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={updatePostMutation.isPending}
            >
              {updatePostMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default EditPost;
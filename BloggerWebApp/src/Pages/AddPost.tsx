import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../Queries/useCurrentUser";
import { usePostMutations } from "../Queries/usePostMutations";
import { Button, Container, Typography, Box, TextField, Paper } from "@mui/material";

interface FormData {
  title: string;
  content: string;
}

function AddPost() {
  const navigate = useNavigate();
  const { data: currentUser } = useCurrentUser();
  const { addPostMutation, errorMessage } = usePostMutations(() => navigate("/"));

  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
  });

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !currentUser) return;

    const newPost = {
      title: formData.title,
      content: formData.content,
      author: currentUser.id,
      authorId: currentUser.id
    };

    addPostMutation.mutate(newPost);
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <Container maxWidth="md">
      <Box py={4}>
        <Typography variant="h4" gutterBottom>Add New Post</Typography>

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
            <Button onClick={handleCancel} variant="outlined">
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={addPostMutation.isPending}
            >
              {addPostMutation.isPending ? "Posting..." : "Add Post"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default AddPost;

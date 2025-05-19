import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePosts } from "../Queries/usePosts";
import { usePostMutations } from "../Queries/usePostMutations";
import { Post } from "../Models/Post";
import { PostList } from "../Components/PostList";
import { PostForm } from "../Components/PostForm";
import { Button, Container, Typography, Box } from "@mui/material";

type NewPost = Omit<Post, "id" | "createdDate" | "lastModifiedDate">;
type User = { id: number; userName: string };

function Home() {
  const navigate = useNavigate();
  const { posts = [], loading: postsLoading } = usePosts();
  const [, setSelectedPostId] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  
  const [formOpen, setFormOpen] = useState(false);

  const { addPostMutation, deletePostMutation, errorMessage } = usePostMutations(() => {
    setFormOpen(false);
    setSelectedPostId(null);
  });

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleAddPost = (newPost: NewPost) => {
    addPostMutation.mutate(newPost);
  };

  const handleDeletePost = (id: number) => {
    deletePostMutation.mutate(id);
  };

  const handleViewPost = (postId: number) => {
    navigate(`/post/${postId}`);
  };

  const handleEditPost = (postId: number) => {
    navigate(`/post/${postId}/edit`);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedPostId(null);
  };

const handleLogout = async () => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (err: unknown) {
    console.error("Error during logout:", err);
    alert(`Network error during logout: ${err}`);
    return;
  }
  sessionStorage.removeItem("user");
  setUser(null);
};

  if (postsLoading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" padding={4}>
          <Typography>Loading posts...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Blog Posts</Typography>
          <Box display="flex" gap={2} alignItems="center">
            {user ? (
              <>
                <Typography variant="body1">
                  Welcome, {user.userName}
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => {
                    setSelectedPostId(null);
                    setFormOpen(true);
                  }}
                >
                  Add Post
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                variant="outlined" 
                color="secondary"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            )}
          </Box>
        </Box>

        <PostList 
          posts={posts} 
          onView={handleViewPost}
          onEdit={handleEditPost} 
          onDelete={handleDeletePost} 
        />

        {formOpen && (
          <PostForm
            open={formOpen}
            post={null}
            onClose={handleCloseForm}
            onSubmit={handleAddPost}
          />
        )}

        {errorMessage && (
          <Box mt={2} p={2} bgcolor="#ffe6e6" borderRadius={1}>
            <Typography color="error">
              <strong>Error:</strong> {errorMessage}
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default Home;
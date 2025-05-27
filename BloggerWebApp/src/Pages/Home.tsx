import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePosts } from "../Queries/usePosts";
import { usePostMutations } from "../Queries/usePostMutations";
import { useCurrentUser } from "../Queries/useCurrentUser";
import { Post } from "../Models/Post";
import { PostList } from "../Components/PostList";
import { PostForm } from "../Components/PostForm";
import { Button, Container, Typography, Box } from "@mui/material";

type NewPost = Omit<Post, "id" | "createdDate" | "lastModifiedDate" | "author"> & {
  title: string;
  content: string;
};

type User = { 
  id: string; 
  userName: string; 
  displayName: string;
  role: string; 
};

function Home() {
  const navigate = useNavigate();
  const { posts = [], loading: postsLoading } = usePosts();
  const { data: currentUser } = useCurrentUser();
  const user: User | null = currentUser
    ? { 
        id: currentUser.id, 
        userName: currentUser.userName,
        displayName: currentUser.displayName || currentUser.userName,
        role: currentUser.roles?.[0] || "User" 
      }
    : null;
  const [, setSelectedPostId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const { addPostMutation, errorMessage } = usePostMutations(() => {
    setFormOpen(false);
    setSelectedPostId(null);
  });

  const handleAddPost = (newPost: NewPost) => {
    const postWithAuthor = {
      ...newPost,
      author: user?.id || ""
    };
    addPostMutation.mutate(postWithAuthor);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedPostId(null);
  };

  const handleLogout = async () => {
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    sessionStorage.removeItem("user");
    window.location.reload();
  };

  if (postsLoading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" padding={4}>
          <Typography>Loading…</Typography>
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
                Welcome, {user.displayName}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/add-post")}
              >
                Add Post
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/edit-profile")}
              >
                Edit Profile
              </Button>

              {user.role === "Admin" && (
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => navigate("/manage-users")}
                >
                  Manage Users
                </Button>
              )}

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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Typography, Box, TextField, Alert, CircularProgress } from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Unexpected server response.",
        }));
        throw new Error(errorData.message || "Login failed.");
      }

      const data = await response.json();

      sessionStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes("Failed to fetch")) {
          setError("Network error.");
        } else {
          setError(err.message || "Login failed.");
        }
      } else {
        setError("Login failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => navigate("/register")}
            >
              Don't have an account?
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
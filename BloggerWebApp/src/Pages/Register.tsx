import { useState } from "react";
import { Container, Box, Typography, TextField, Button, Alert, CircularProgress, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    password: "",
    confirmPassword: "",
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

    if (!formData.username.trim()) {
      setError("Username cannot be empty or contain spaces.");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (formData.password.trim() !== formData.confirmPassword.trim()) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password.trim(),
          confirmPassword: formData.confirmPassword.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => {
          throw new Error("Unexpected server response.");
        });
        throw new Error(errorData.message || "Registration failed.");
      }

      const data = await response.json();

      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes("Failed to fetch")) {
          setError("Network error.");
        } else {
          setError(err.message || "Registration failed.");
        }
      } else {
        setError("Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
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

            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              fullWidth
              required
              error={!!error && formData.password.trim() !== formData.confirmPassword.trim()}
              helperText={
                !!error && formData.password.trim() !== formData.confirmPassword.trim()
                  ? "Passwords do not match"
                  : ""
              }
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "Registering..." : "Register"}
            </Button>

            <Button variant="outlined" color="secondary" onClick={() => navigate("/login")}>
              Already have an account?
            </Button>
          </Box>
        </form>

        <Snackbar
          open={success}
          autoHideDuration={3000}
          message="Registration successful! Redirecting..."
          onClose={() => setSuccess(false)}
        />
      </Box>
    </Container>
  );
};

export default Register;
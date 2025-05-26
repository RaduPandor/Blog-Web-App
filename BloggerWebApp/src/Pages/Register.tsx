import { useState } from "react";
import { Container, Box, Typography, TextField, Button, Alert, CircularProgress, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface RegisterFormData {
  username: string;
  displayName: string;
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
    displayName: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one digit");
    }
      if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("Password must contain at least one special character");
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!formData.username.trim()) {
      setError("Username cannot be empty or contain spaces.");
      return;
    }
    
    if (!formData.displayName.trim()) {
      setError("Display name cannot be empty.");
      return;
    }

    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      setError(passwordErrors.join(". "));
      return;
    }

    if (formData.password.trim() !== formData.confirmPassword.trim()) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: formData.username.trim(),
          displayName: formData.displayName.trim(),
          password: formData.password.trim(),
          confirmPassword: formData.confirmPassword.trim(),
        }),
      });

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json().catch(() => {
          throw new Error("Unexpected server response.");
        });
        throw new Error(errorData.message || "Registration failed.");
      }

      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password.trim(),
        }),
      });

      if (!loginResponse.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
        return;
      }

      const loginData = await loginResponse.json();
      localStorage.setItem("user", JSON.stringify(loginData.user));

      setSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
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

  const passwordErrors = formData.password ? validatePassword(formData.password) : [];
  const hasPasswordErrors = passwordErrors.length > 0;

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
              helperText="This will be used to log in"
            />

            <TextField
              label="Display Name"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              fullWidth
              required
              helperText="This name will be shown to other users"
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
              error={hasPasswordErrors}
              helperText={
                hasPasswordErrors ? (
                  <Box component="div">
                    <Typography variant="caption" color="error">
                      Password requirements:
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      <li style={{ color: formData.password.length >= 6 ? 'green' : 'red' }}>
                        At least 6 characters
                      </li>
                      <li style={{ color: /[a-z]/.test(formData.password) ? 'green' : 'red' }}>
                        One lowercase letter
                      </li>
                      <li style={{ color: /[A-Z]/.test(formData.password) ? 'green' : 'red' }}>
                        One uppercase letter
                      </li>
                      <li style={{ color: /\d/.test(formData.password) ? 'green' : 'red' }}>
                        One digit
                      </li>
                        <li style={{ color: /[^A-Za-z0-9]/.test(formData.password) ? 'green' : 'red' }}>
                          One special character
                        </li>
                    </ul>
                  </Box>
                ) : (
                  "Must contain uppercase, lowercase, and digit"
                )
              }
            />

            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              fullWidth
              required
              error={!!formData.confirmPassword && formData.password.trim() !== formData.confirmPassword.trim()}
              helperText={
                !!formData.confirmPassword && formData.password.trim() !== formData.confirmPassword.trim()
                  ? "Passwords do not match"
                  : ""
              }
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading || hasPasswordErrors}
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
          message="Registration successful! Logging you in..."
          onClose={() => setSuccess(false)}
        />
      </Box>
    </Container>
  );
};

export default Register;
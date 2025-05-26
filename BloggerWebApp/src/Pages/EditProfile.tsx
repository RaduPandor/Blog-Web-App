import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useUpdateProfile } from "../Queries/useUpdateProfile";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../Queries/useCurrentUser";
import { Button, Container, Typography, TextField, Box, Alert, CircularProgress, Snackbar } from "@mui/material";

interface ProfileFormData {
  username: string;
  displayName: string;
  password: string;
  confirmPassword: string;
}

const EditProfile = () => {
  const navigate = useNavigate();
  const { data: currentUser, error } = useCurrentUser();
  const [formData, setFormData] = useState<ProfileFormData>({
    username: "",
    displayName: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        username: currentUser.userName,
        displayName: currentUser.displayName || currentUser.userName
      }));
    }
  }, [currentUser]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validatePassword = (pw: string) => {
    const errors: string[] = [];
    if (pw && pw.length < 6) errors.push("At least 6 characters");
    if (pw && !/[a-z]/.test(pw)) errors.push("One lowercase letter");
    if (pw && !/[A-Z]/.test(pw)) errors.push("One uppercase letter");
    if (pw && !/\d/.test(pw)) errors.push("One digit");
    if (pw && !/[^A-Za-z0-9]/.test(pw)) errors.push("One special character");
    return errors;
  };

  const updateProfileMutation = useUpdateProfile();
  const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      setErrorMsg("");

      if (!formData.username.trim()) {
          setErrorMsg("Username cannot be empty");
          return;
      }

      if (!formData.displayName.trim()) {
          setErrorMsg("Display name cannot be empty");
          return;
      }

      if (formData.password || formData.confirmPassword) {
          if (formData.password !== formData.confirmPassword) {
              setErrorMsg("Passwords do not match");
              return;
          }

          const pwErrors = validatePassword(formData.password);
          if (pwErrors.length) {
              setErrorMsg(pwErrors.join(", "));
              return;
          }
      }

      updateProfileMutation.mutate(formData, {
          onSuccess: () => {
              setSuccess(true);
              setTimeout(() => navigate("/"), 2000);
          },
          onError: (error: unknown) => {
              console.error("Mutation error:", error);
              setErrorMsg("Update failed");
          }
      });
  };

  if (error) {
    return <Container><Alert severity="error">Error loading user</Alert></Container>;
  }

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>Edit Profile</Typography>
        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Display Name"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="New Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            helperText="Leave blank to keep current password"
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={() => navigate('/')} variant="outlined">Cancel</Button>
                <Button type="submit" variant="contained" disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending ? <CircularProgress size={20}/> : 'Save Changes'}
                </Button>
          </Box>
        </form>
        <Snackbar open={success} autoHideDuration={2000} message="Profile updated"/>
      </Box>
    </Container>
  );
};

export default EditProfile;

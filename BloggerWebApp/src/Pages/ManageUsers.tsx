import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Button, Box, Table, TableBody, TableCell, TableHead, TableRow, 
  TextField, Select, MenuItem, Checkbox, Dialog, DialogTitle, DialogContent, 
  DialogActions, Snackbar, Alert, FormControl, InputLabel
} from "@mui/material";

type User = {
  id: string;
  username: string;
  displayName: string;
  role: string;
};

type CreateUserDto = {
  username: string;
  displayName: string;
  password: string;
  isAdmin: boolean;
};

export default function ManageUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ username: "", displayName: "", password: "", isAdmin: false });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditUser, setCurrentEditUser] = useState<User | null>(null);
  const [editData, setEditData] = useState({ username: "", displayName: "", role: "User" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/Auth/getall`, { credentials: "include" });
      if (!res.ok) {
        throw new Error(`Failed to fetch users: ${res.status}`);
      }
      const data: User[] = await res.json();
      const normalizedUsers = data.map(u => ({
        id: u.id,
        username: u.username,
        displayName: u.displayName || u.username,
        role: u.role || "User"
      }));
      setUsers(normalizedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      showSnackbar("Failed to fetch users", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const openEditDialog = (user: User) => {
    setCurrentEditUser(user);
    setEditData({
      username: user.username,
      displayName: user.displayName,
      role: user.role
    });
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setCurrentEditUser(null);
    setEditData({ username: "", displayName: "", role: "User" });
  };

  const handleSaveChanges = async () => {
    if (!currentEditUser) return;

    try {
      const updateResponse = await fetch(`${API_BASE_URL}/Auth/${currentEditUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          username: editData.username,
          displayName: editData.displayName 
        }),
      });
      
      if (!updateResponse.ok) {
        throw new Error(`Failed to update user: ${updateResponse.status}`);
      }
      
      if (editData.role !== currentEditUser.role) {
        const roleResponse = await fetch(`${API_BASE_URL}/Auth/${currentEditUser.id}/role`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ role: editData.role }),
        });
        
        if (!roleResponse.ok) {
          throw new Error(`Failed to update role: ${roleResponse.status}`);
        }
      }
      
      showSnackbar("User updated successfully", "success");
      closeEditDialog();
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      showSnackbar(`Failed to update user: ${error instanceof Error ? error.message : "Unknown error"}`, "error");
    }
  };

  const handleDeleteUser = async () => {
    if (!currentEditUser) return;

    try {
      const response = await fetch(`${API_BASE_URL}/Auth/${currentEditUser.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.status}`);
      }
      
      showSnackbar("User deleted successfully", "success");
      closeEditDialog();
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      showSnackbar(`Failed to delete user: ${error instanceof Error ? error.message : "Unknown error"}`, "error");
    }
  };

  const handleAddUser = async () => {
    try {
      if (!newUser.username || !newUser.displayName || !newUser.password) {
        showSnackbar("Username, display name, and password are required", "error");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/Auth/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: newUser.username,
          displayName: newUser.displayName,
          password: newUser.password,
          isAdmin: newUser.isAdmin
        } as CreateUserDto),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create user: ${response.status}`);
      }

      showSnackbar("User created successfully", "success");
      setNewUser({ username: "", displayName: "", password: "", isAdmin: false });
      fetchUsers();
    } catch (error) {
      showSnackbar(
        `Failed to create user: ${error instanceof Error ? error.message : "Unknown error"}`,
        "error"
      );
    }
  };

  const hasChanges = currentEditUser && (
    editData.username !== currentEditUser.username ||
    editData.displayName !== currentEditUser.displayName ||
    editData.role !== currentEditUser.role
  );

  return (
    <Container>
      <Box py={4} display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h4">Manage Users</Typography>
        <Button variant="outlined" onClick={() => navigate('/')}>Back to Home</Button>
      </Box>

      <Box mt={4} p={3} border={1} borderColor="grey.300" borderRadius={2}>
        <Typography variant="h6" gutterBottom>Add New User</Typography>
        <Box display="flex" gap={2} mt={2} alignItems="center" flexWrap="wrap">
          <TextField
            label="Username"
            value={newUser.username}
            onChange={e => setNewUser(n => ({ ...n, username: e.target.value }))}
            required
            size="small"
          />
          <TextField
            label="Display Name"
            value={newUser.displayName}
            onChange={e => setNewUser(n => ({ ...n, displayName: e.target.value }))}
            required
            size="small"
          />
          <TextField
            label="Password"
            type="password"
            value={newUser.password}
            onChange={e => setNewUser(n => ({ ...n, password: e.target.value }))}
            required
            size="small"
          />
          <Box display="flex" alignItems="center">
            <Checkbox
              checked={newUser.isAdmin}
              onChange={e => setNewUser(n => ({ ...n, isAdmin: e.target.checked }))}
            />
            <Typography>Admin Role</Typography>
          </Box>
          <Button 
            variant="contained" 
            onClick={handleAddUser}
            disabled={!newUser.username || !newUser.displayName || !newUser.password}
          >
            Add User
          </Button>
        </Box>
      </Box>

      <Box mt={4}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Username</strong></TableCell>
              <TableCell><strong>Display Name</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.displayName}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button 
                    variant="outlined"
                    size="small"
                    onClick={() => openEditDialog(user)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Dialog open={editDialogOpen} onClose={closeEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} mt={2}>
            <TextField
              label="Username"
              value={editData.username}
              onChange={e => setEditData(prev => ({ ...prev, username: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Display Name"
              value={editData.displayName}
              onChange={e => setEditData(prev => ({ ...prev, displayName: e.target.value }))}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={editData.role}
                label="Role"
                onChange={e => setEditData(prev => ({ ...prev, role: e.target.value }))}
              >
                <MenuItem value="User">User</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>
          <Button 
            onClick={handleDeleteUser} 
            color="error"
            variant="outlined"
          >
            Delete User
          </Button>
          <Button 
            onClick={handleSaveChanges} 
            variant="contained"
            disabled={!hasChanges}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
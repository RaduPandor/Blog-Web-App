import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, Table, TableBody, TableCell, TableHead, TableRow, TextField, Select, 
    MenuItem, Checkbox, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Snackbar, Alert} from "@mui/material";

type ApiUser = {
  id: string;
  username: string;
  role: string | null;
};

type UserRow = {
  id: string;
  username: string;
  role: string;
};

type CreateUserDto = {
  username: string;
  password: string;
  isAdmin: boolean;
};

export default function ManageUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [edited, setEdited] = useState<Record<string, { username: string; role: string }>>({});
  const [newUser, setNewUser] = useState({ username: "", password: "", isAdmin: false });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/Auth/getall`, { credentials: "include" });
      if (!res.ok)
        {
         throw new Error(`Failed to fetch users: ${res.status}`);
        }
      const data: ApiUser[] = await res.json();
      const rows = data.map(u => ({
        id: u.id,
        username: u.username,
        role: u.role || ""
      }));
      setUsers(rows);
      setEdited(Object.fromEntries(rows.map(r => [r.id, { username: r.username, role: r.role }])));
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

  const handleSave = async (id: string) => {
    try {
      const { username, role } = edited[id];
      const usernameResponse = await fetch(`${API_BASE_URL}/Auth/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username }),
      });
      
      if (!usernameResponse.ok) {
        throw new Error(`Failed to update username: ${usernameResponse.status}`);
      }
      
      const roleToSend = role === "User" || role === "" ? "User" : role;    
      const roleResponse = await fetch(`${API_BASE_URL}/Auth/${id}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role: roleToSend }),
      });
      
      if (!roleResponse.ok) {
        throw new Error(`Failed to update role: ${roleResponse.status}`);
      }
      
      showSnackbar("User updated successfully", "success");
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      showSnackbar(`Failed to update user: ${error instanceof Error ? error.message : "Unknown error"}`, "error");
    }
  };

  const openDeleteDialog = (id: string) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        const response = await fetch(`${API_BASE_URL}/Auth/${userToDelete}`, {
          method: "DELETE",
          credentials: "include",
        });
        
        if (!response.ok) {
          throw new Error(`Failed to delete user: ${response.status}`);
        }
        
        showSnackbar("User deleted successfully", "success");
        setDeleteDialogOpen(false);
        setUserToDelete(null);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        showSnackbar(`Failed to delete user: ${error instanceof Error ? error.message : "Unknown error"}`, "error");
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleAdd = async () => {
    try {
      if (!newUser.username || !newUser.password) {
        showSnackbar("Username and password are required", "error");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/Auth/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: newUser.username,
          password: newUser.password,
          isAdmin: newUser.isAdmin
        } as CreateUserDto),
      });

      if (!response.ok) {
        throw new Error(`Failed to create user: ${response.status}`);
      }

      const result = await response.json();
      if (newUser.isAdmin && result.userId) {
        const roleResponse = await fetch(`${API_BASE_URL}/Auth/${result.userId}/role`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ role: "Admin" }),
        });

        if (!roleResponse.ok) {
          showSnackbar("User created but failed to assign admin role", "error");
        }
      }

      showSnackbar("User created successfully", "success");
      setNewUser({ username: "", password: "", isAdmin: false });
      fetchUsers();
    } catch (error) {
      showSnackbar(
        `Failed to create user: ${error instanceof Error ? error.message : "Unknown error"}`,
        "error"
      );
    }
  };

  const normalizeRole = (role: string): string => {
    return role === "" ? "User" : role;
  };

  return (
    <Container>
      <Box py={4} display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h4">Manage Users</Typography>
        <Button variant="outlined" onClick={() => navigate('/')}>Back to Home</Button>
      </Box>
            <Box mt={4}>
        <Typography variant="h6">Add New User</Typography>
        <Box display="flex" gap={2} mt={2} alignItems="center">
          <TextField
            label="Username"
            value={newUser.username}
            onChange={e => setNewUser(n => ({ ...n, username: e.target.value }))}
            required
          />
          <TextField
            label="Password"
            type="password"
            value={newUser.password}
            onChange={e => setNewUser(n => ({ ...n, password: e.target.value }))}
            required
          />
          <Box display="flex" alignItems="center">
            <Checkbox
              checked={newUser.isAdmin}
              onChange={e => setNewUser(n => ({ ...n, isAdmin: e.target.checked }))}
            />
            <Typography>Add Admin Role?</Typography>
          </Box>
          <Button 
            variant="contained" 
            onClick={handleAdd}
            disabled={!newUser.username || !newUser.password}
          >
            Add User
          </Button>
        </Box>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Current Username</TableCell>
            <TableCell>New Username</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(u => (
            <TableRow key={u.id}>
              <TableCell>{u.id}</TableCell>
              <TableCell>
                <Typography>{u.username}</Typography>
              </TableCell>
              <TableCell>
                <TextField
                  placeholder="New Username"
                  value={edited[u.id]?.username || ""}
                  onChange={e =>
                    setEdited(ed => ({
                      ...ed,
                      [u.id]: { ...ed[u.id], username: e.target.value }
                    }))
                  }
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Select
                  value={edited[u.id]?.role === "" ? "User" : edited[u.id]?.role || "User"}
                  onChange={e =>
                    setEdited(ed => ({
                      ...ed,
                      [u.id]: { ...ed[u.id], role: e.target.value }
                    }))
                  }
                  size="small"
                >
                  <MenuItem value="User">User</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </Select>
              </TableCell>
              <TableCell>
                <Button 
                  onClick={() => handleSave(u.id)}
                  disabled={
                    edited[u.id]?.username === u.username && 
                    normalizeRole(edited[u.id]?.role) === normalizeRole(u.role)
                  }
                >
                  Save
                </Button>
                <Button color="error" onClick={() => openDeleteDialog(u.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
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
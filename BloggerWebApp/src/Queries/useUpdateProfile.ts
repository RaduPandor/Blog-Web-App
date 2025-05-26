import { useMutation } from "@tanstack/react-query";

interface ProfileFormData {
  username: string;
  displayName: string;
  password?: string;
  confirmPassword?: string;
}

const API = import.meta.env.VITE_API_URL;

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async (formData: ProfileFormData) => {
      const response = await fetch(`${API}/auth/editprofile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to update profile");
      }

      return response.json();
    },
  });
};

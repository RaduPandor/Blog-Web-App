export type CurrentUser = {
  displayName: string;
  id: string;
  userName: string;
  roles: string[];
};

const API_BASE_URL = import.meta.env.VITE_API_URL;
export async function fetchCurrentUser(): Promise<CurrentUser> {
  const res = await fetch(`${API_BASE_URL}/Auth/me`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (res.status === 401) {
    throw new Error("Not authenticated");
  }
  if (!res.ok) {
    throw new Error(`Error ${res.status}`);
  }
  return res.json();
}

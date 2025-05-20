
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { fetchCurrentUser, CurrentUser } from "../Services/AuthService";

export function useCurrentUser() {
  const stored = sessionStorage.getItem("user");
  const parsed: CurrentUser | undefined = stored
    ? JSON.parse(stored) as CurrentUser
    : undefined;

  return useQuery<CurrentUser, Error, CurrentUser, ["currentUser"]>({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    initialData: parsed,
    onSuccess: (data: { roles: string[]; id: unknown; userName: unknown; }) => {
      const role = data.roles[0] ?? "";
      sessionStorage.setItem(
        "user",
        JSON.stringify({ id: data.id, userName: data.userName, roles: [role] })
      );
    },
    onError: (err: { message: string; }) => {
      if (err.message === "Not authenticated") {
        sessionStorage.removeItem("user");
      }
    },
    refetchOnWindowFocus: false,
  } as UseQueryOptions<CurrentUser, Error, CurrentUser, ["currentUser"]>);
}

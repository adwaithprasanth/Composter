import { authClient } from "./auth-client";

export async function fetchUser() {
  const { data, error } = await authClient.getSession();

  if (error || !data) return null;

  return data.user;
}

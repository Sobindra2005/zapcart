import { removeAuthToken } from "@/app/actions/auth.actions";
import { useAuthStore } from "@/stores/auth/auth.store";
import { useUserStore } from "@/stores/user/user.store";
import { authApi } from "./api";

/**
 * Centralized logout function
 * Handles all cleanup: cookies, auth state, and user state
 */
export async function handleLogout() {
  try {
    await authApi.logout();
    await removeAuthToken();
    useUserStore.getState().clearUser();
    useAuthStore.getState().logout();
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error };
  }
}

"use server";

import { createServerClientInstance } from "@/utils/supabase/server";
import { useAuthStore } from "./useAuthStore";

export async function readUserSession() {
  const supabase = await createServerClientInstance();

  try {
    // Hent brugerdata fra Supabase session
    const { data: userResponse, error: userError } =
      await supabase.auth.getUser();

    if (userError || !userResponse?.user) {
      console.error("User fetch error:", userError?.message || "No user found");
      return null;
    }

    // Hent rolle direkte fra brugerens metadata
    const role = userResponse.user.user_metadata?.role;

    if (!role) {
      console.error("Role not found in metadata");
      return null;
    }

    return {
      user: userResponse.user,
      role,
    };
  } catch (error) {
    console.error("Unexpected error in readUserSession:", error);
    return null;
  }
}

export async function fetchAndSetUserSession() {
  try {
    const session = await readUserSession();

    if (session) {
      useAuthStore.getState().setUser({
        id: session.user.id,
        email: session.user.email,
      });
      useAuthStore.getState().setRole(session.role as "admin" | "editor");
    } else {
      useAuthStore.getState().clearSession();
    }
  } catch (error) {
    console.error("Failed to fetch and set session:", error);
    useAuthStore.getState().clearSession();
  }
}

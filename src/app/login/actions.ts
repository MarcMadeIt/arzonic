"use server";

import { createServerClientInstance } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const supabase = await createServerClientInstance();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error("Failed to login:", error.message);
    redirect("/login?error=true");
  } else {
    revalidatePath("/", "layout");
    redirect("/admin");
  }
}

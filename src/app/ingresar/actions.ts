"use server";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { loginSchema } from "@/modules/identity/schemas";

export type LoginState = { error: string };
export async function signIn(_previous: LoginState, form: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({ email: form.get("email"), password: form.get("password") });
  if (!parsed.success) return { error: "Ingresa un correo válido y tu contraseña." };
  if (!getSupabaseConfig()) return { error: "Falta configurar la conexión a Supabase." };
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error) return { error: "No pudimos iniciar sesión. Revisa tus datos o inténtalo más tarde." };
  } catch { return { error: "El servicio de acceso no está disponible. Inténtalo más tarde." }; }
  redirect("/panel");
}
export async function signOut() {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) throw new Error("No fue posible cerrar sesión. Inténtalo nuevamente.");
  redirect("/ingresar");
}

import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseConfig } from "./config";

export async function createSupabaseServerClient() {
  const config = getSupabaseConfig();
  if (!config) throw new Error("Supabase no configurado");
  const store = await cookies();
  return createServerClient(config.url, config.key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll(values) {
        // Server Components no pueden escribir; proxy.ts renueva la sesión.
        try { values.forEach(({ name, value, options }) => store.set(name, value, options)); }
        catch { /* Solo se omite escritura en render de Server Components. */ }
      },
    },
  });
}

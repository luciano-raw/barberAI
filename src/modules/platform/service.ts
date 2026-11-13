import "server-only";
import { notFound } from "next/navigation";
import { z } from "zod";
import { requireSession } from "@/modules/identity/service";
import { tenantSchema } from "@/modules/identity/schemas";

export async function requirePlatformAdmin() {
  const { supabase } = await requireSession();
  const { data, error } = await supabase.rpc("is_platform_admin");
  if (error?.code === "PGRST202") notFound();
  if (error) throw new Error("No fue posible comprobar el acceso de plataforma.");
  if (data !== true) notFound();
  return supabase;
}

export async function listPlatformTenants() {
  const supabase = await requirePlatformAdmin();
  const { data, error } = await supabase.rpc("platform_list_tenants");
  if (error) throw new Error("No fue posible cargar las barberías.");
  return z.array(tenantSchema).parse(data);
}

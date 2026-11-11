import "server-only";
import { redirect, notFound } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { membershipSchema, tenantSchema } from "./schemas";

export async function requireSession() {
  if (!getSupabaseConfig()) redirect("/ingresar");
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/ingresar");
  return { supabase, user: data.user };
}

export async function listMyTenants() {
  const { supabase, user } = await requireSession();
  const { data, error } = await supabase.from("memberships").select("tenant_id, role")
    .eq("user_id", user.id).eq("active", true);
  if (error) throw new Error("No fue posible consultar tus accesos. Verifica la migración y las políticas RLS.");
  const memberships = z.array(membershipSchema).parse(data);
  if (!memberships.length) return [];
  const tenants = await supabase.from("tenants").select("id, name, status").in("id", memberships.map(m => m.tenant_id));
  if (tenants.error) throw new Error("No fue posible consultar las barberías autorizadas.");
  return z.array(tenantSchema).parse(tenants.data).map(tenant => ({
    ...tenant, role: memberships.find(m => m.tenant_id === tenant.id)!.role,
  }));
}

export async function requireTenant(tenantId: string) {
  if (!z.uuid().safeParse(tenantId).success) notFound();
  const { supabase, user } = await requireSession();
  const result = await supabase.from("memberships").select("tenant_id, role")
    .eq("tenant_id", tenantId).eq("user_id", user.id).eq("active", true).maybeSingle();
  if (result.error) throw new Error("No fue posible comprobar los permisos.");
  if (!result.data) notFound();
  const membership = membershipSchema.parse(result.data);
  const tenantResult = await supabase.from("tenants").select("id, name, status").eq("id", tenantId).maybeSingle();
  if (tenantResult.error) throw new Error("No fue posible cargar la barbería.");
  if (!tenantResult.data) notFound();
  return { supabase, user, membership, tenant: tenantSchema.parse(tenantResult.data) };
}

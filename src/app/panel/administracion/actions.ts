"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePlatformAdmin } from "@/modules/platform/service";

const path = "/panel/administracion";
const createSchema = z.object({ name: z.string().trim().min(1).max(120), owner: z.uuid() });
const statusSchema = z.object({
  id: z.uuid(),
  expected: z.enum(["active", "paused"]),
  status: z.enum(["active", "paused", "archived"]),
});

export async function createTenant(form: FormData) {
  const supabase = await requirePlatformAdmin();
  const parsed = createSchema.safeParse({ name: form.get("name"), owner: form.get("owner") });
  if (!parsed.success) redirect(path + "?resultado=datos");
  const { error } = await supabase.rpc("platform_create_tenant", {
    p_name: parsed.data.name,
    p_owner: parsed.data.owner,
  });
  if (error) redirect(path + (error.code === "23503" ? "?resultado=responsable" : "?resultado=error"));
  revalidatePath("/panel");
  redirect(path + "?resultado=creada");
}

export async function changeTenantStatus(form: FormData) {
  const supabase = await requirePlatformAdmin();
  const parsed = statusSchema.safeParse({
    id: form.get("id"),
    expected: form.get("expected"),
    status: form.get("status"),
  });
  if (!parsed.success) redirect(path + "?resultado=datos");
  const { data, error } = await supabase.rpc("platform_set_tenant_status", {
    p_tenant: parsed.data.id,
    p_expected: parsed.data.expected,
    p_status: parsed.data.status,
  });
  if (error) redirect(path + "?resultado=error");
  revalidatePath("/panel");
  redirect(path + (data === true ? "?resultado=estado" : "?resultado=conflicto"));
}

import "server-only";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";

export const sections = { resumen: "Resumen", agenda: "Agenda", clientes: "Clientes", equipo: "Equipo", servicios: "Servicios", actividad: "Actividad" } as const;
export type Section = keyof typeof sections;
const schemas = {
  barbers: z.object({ id: z.uuid(), name: z.string(), active: z.boolean() }),
  customers: z.object({ id: z.uuid(), name: z.string().nullable(), phone_e164: z.string() }),
  services: z.object({ id: z.uuid(), name: z.string(), duration_minutes: z.number(), price_clp: z.number(), active: z.boolean() }),
  calendar_entries: z.object({ id: z.uuid(), kind: z.string(), status: z.string(), starts_at: z.string(), ends_at: z.string() }),
  audit_events: z.object({ id: z.uuid(), action: z.string(), actor_type: z.string(), created_at: z.string() }),
};
const selects = {
  barbers: "id, name, active", customers: "id, name, phone_e164", services: "id, name, duration_minutes, price_clp, active",
  calendar_entries: "id, kind, status, starts_at, ends_at", audit_events: "id, action, actor_type, created_at",
} as const;
type Table = keyof typeof schemas;
export async function readRows<T extends Table>(supabase: SupabaseClient, tenantId: string, table: T) {
  const order = table === "calendar_entries" ? "starts_at" : table === "audit_events" ? "created_at" : "id";
  const { data, error } = await supabase.from(table).select(selects[table]).eq("tenant_id", tenantId)
    .order(order, { ascending: table !== "audit_events" }).limit(100);
  if (error) throw new Error("No fue posible cargar los datos autorizados.");
  return z.array(schemas[table]).parse(data) as z.infer<(typeof schemas)[T]>[];
}
export async function readCounts(supabase: SupabaseClient, tenantId: string, isBarber: boolean) {
  const tables = isBarber ? ["barbers", "services", "calendar_entries"] as const : ["barbers", "services", "customers", "calendar_entries"] as const;
  const results = await Promise.all(tables.map(table => supabase.from(table).select("id", { count: "exact", head: true }).eq("tenant_id", tenantId)));
  if (results.some(r => r.error)) throw new Error("No fue posible cargar los indicadores.");
  return tables.map((table, i) => ({ table, count: results[i].count ?? 0 }));
}

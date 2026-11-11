import { z } from "zod";
export const loginSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(1).max(256),
});
export const membershipSchema = z.object({
  tenant_id: z.uuid(),
  role: z.enum(["owner", "manager", "barber"]),
});
export const tenantSchema = z.object({
  id: z.uuid(), name: z.string(), status: z.enum(["active", "paused", "archived"]),
});

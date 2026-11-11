import { z } from "zod";
export const tenantContextSchema = z.object({
  tenantId: z.uuid(),
  userId: z.uuid(),
  role: z.enum(["owner", "manager", "barber"]),
});
/** Solo construir después de verificar sesión y membresía en el servidor. */
export type TenantContext = z.infer<typeof tenantContextSchema>;

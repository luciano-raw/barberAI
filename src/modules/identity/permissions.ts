export type MemberRole = "owner" | "manager" | "barber";
/** Matriz de lectura inicial; las escrituras permanecen cerradas por RLS. */
export function canReadSection(role: MemberRole, section: string): boolean {
  const common = ["resumen", "agenda", "equipo", "servicios"];
  if (common.includes(section)) return true;
  return role !== "barber" && ["clientes", "actividad"].includes(section);
}

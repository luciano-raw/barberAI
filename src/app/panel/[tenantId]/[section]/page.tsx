import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/panel/data-table";
import { signOut } from "@/app/ingresar/actions";
import { requireTenant } from "@/modules/identity/service";
import { canReadSection } from "@/modules/identity/permissions";
import { readCounts, readRows, sections, type Section } from "@/modules/operations/read-model";
export const dynamic = "force-dynamic";
const date = (value: string) => new Intl.DateTimeFormat("es-CL", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Santiago" }).format(new Date(value));
const money = (value: number) => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(value);
const status: Record<string, string> = { confirmed: "Confirmada", completed: "Completada", cancelled: "Cancelada", no_show: "No asistió" };
const countNames: Record<string, string> = { barbers: "Barberos", services: "Servicios", customers: "Clientes", calendar_entries: "Registros de agenda" };

export default async function TenantPanel({ params }: { params: Promise<{ tenantId: string; section: string }> }) {
  const { tenantId, section: rawSection } = await params;
  if (!Object.hasOwn(sections, rawSection)) notFound();
  const section = rawSection as Section;
  const { supabase, membership, tenant } = await requireTenant(tenantId);
  const isBarber = membership.role === "barber";
  if (!canReadSection(membership.role, section)) notFound();
  let headings: string[] = [];
  let rows: string[][] = [];
  let counts: Awaited<ReturnType<typeof readCounts>> = [];
  if (section === "resumen") counts = await readCounts(supabase, tenantId, isBarber);
  if (section === "agenda") {
    headings = ["Inicio · Santiago", "Término · Santiago", "Tipo", "Estado"];
    rows = (await readRows(supabase, tenantId, "calendar_entries")).map(r => [date(r.starts_at), date(r.ends_at), r.kind === "booking" ? "Reserva" : "Bloqueo", status[r.status] ?? r.status]);
  }
  if (section === "clientes") {
    headings = ["Cliente", "WhatsApp"];
    rows = (await readRows(supabase, tenantId, "customers")).map(r => [r.name || "Sin nombre registrado", r.phone_e164]);
  }
  if (section === "equipo") {
    headings = ["Barbero", "Estado"];
    rows = (await readRows(supabase, tenantId, "barbers")).map(r => [r.name, r.active ? "Activo" : "Inactivo"]);
  }
  if (section === "servicios") {
    headings = ["Servicio", "Duración", "Precio", "Estado"];
    rows = (await readRows(supabase, tenantId, "services")).map(r => [r.name, `${r.duration_minutes} min`, money(r.price_clp), r.active ? "Activo" : "Inactivo"]);
  }
  if (section === "actividad") {
    headings = ["Fecha · Santiago", "Acción", "Origen"];
    rows = (await readRows(supabase, tenantId, "audit_events")).map(r => [date(r.created_at), r.action, ({ human: "Equipo", agent: "Asistente", system: "Sistema" })[r.actor_type] ?? r.actor_type]);
  }
  const nav = Object.entries(sections).filter(([key]) => canReadSection(membership.role, key));
  return <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
    <aside className="border-b border-border bg-white px-5 py-7 md:border-r"><Link href="/panel" className="px-3 text-2xl font-bold tracking-tight">Barber<span className="text-primary">AI</span></Link><p className="mt-8 truncate px-3 text-sm font-semibold">{tenant.name}</p><p className="mt-1 px-3 text-xs text-slate-500">{({ owner: "Propietario", manager: "Encargado", barber: "Barbero" })[membership.role]}</p><nav aria-label="Panel de barbería" className="mt-7 flex gap-1 overflow-x-auto md:flex-col">{nav.map(([key, label]) => <Link key={key} href={`/panel/${tenantId}/${key}`} aria-current={section === key ? "page" : undefined} className={`rounded-lg px-4 py-3 text-sm ${section === key ? "bg-muted font-semibold text-primary" : "text-slate-600 hover:bg-slate-50"}`}>{label}</Link>)}</nav><Link href="/panel" className="mt-8 block px-3 text-xs text-slate-500 underline">Cambiar barbería</Link></aside>
    <main className="min-w-0 px-5 py-7 md:px-10"><header className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-6"><p className="text-sm text-slate-500">{tenant.name} / {sections[section]}</p><form action={signOut}><Button variant="outline" size="sm">Cerrar sesión</Button></form></header>
      <div className="flex flex-wrap items-center justify-between gap-3 py-9"><div><p className="text-xs uppercase tracking-widest text-primary">Tu espacio de gestión</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">{sections[section]}</h1></div><span className="rounded-full border border-border bg-white px-3 py-1 text-xs">{tenant.status === "active" ? "Barbería activa" : tenant.status === "paused" ? "Barbería pausada" : "Barbería archivada"}</span></div>
      {tenant.status !== "active" && <p role="status" className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Este establecimiento está {tenant.status === "paused" ? "pausado" : "archivado"}. Puedes consultar la información autorizada.</p>}
      {section === "resumen" ? <><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{counts.map(c => <article key={c.table} className="rounded-xl border border-border bg-white p-6"><p className="text-sm text-slate-500">{isBarber && c.table === "barbers" ? "Tu ficha" : isBarber && c.table === "calendar_entries" ? "Tu agenda" : countNames[c.table]}</p><p className="mt-5 text-4xl font-semibold">{c.count}</p><p className="mt-3 text-xs text-slate-400">Registros visibles para tu rol</p></article>)}</div><section className="mt-6 rounded-xl border border-border bg-white p-7"><h2 className="text-lg font-semibold">Consulta la operación de tu barbería</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">El panel muestra información registrada. Las acciones para gestionar reservas, servicios y equipo se habilitarán en las próximas entregas.</p><Button asChild className="mt-5"><Link href={`/panel/${tenantId}/agenda`}>Abrir agenda</Link></Button></section></> : <section aria-label={sections[section]} className="overflow-hidden rounded-xl border border-border bg-white"><DataTable headings={headings} rows={rows} /><p className="border-t border-border px-6 py-3 text-xs text-slate-500">Vista de consulta · Hasta 100 registros</p></section>}
    </main></div>;
}

import Link from "next/link";
import { requireSession, listMyTenants } from "@/modules/identity/service";
import { PanelAccount, memberRoleLabels } from "@/components/panel/panel-account";
import { Button } from "@/components/ui/button";
export const dynamic = "force-dynamic";
export default async function PanelPage() {
  const { supabase, user } = await requireSession();
  const { data: isPlatformAdmin } = await supabase.rpc("is_platform_admin");
  const tenants = await listMyTenants();
  const roles = [...new Set(tenants.map(tenant => memberRoleLabels[tenant.role]))];
  const role = isPlatformAdmin === true ? "Superadministrador" : roles.join(" · ") || "Sin membresía";
  return <main className="mx-auto max-w-4xl px-6 py-14"><header className="flex flex-wrap items-center justify-between gap-4"><Link href="/" className="text-2xl font-bold text-primary">BarberAI</Link><PanelAccount email={user.email} role={role} /></header>{isPlatformAdmin === true && <Button asChild className="mt-8"><Link href="/panel/administracion">Administrar barberías</Link></Button>}<h1 className="mt-14 text-3xl font-semibold">Tus barberías</h1><p className="mt-3 text-slate-500">Selecciona el establecimiento que quieres gestionar.</p><div className="mt-8 grid gap-4 sm:grid-cols-2">{tenants.map(t => <Link key={t.id} href={`/panel/${t.id}/resumen`} className="rounded-xl border border-border bg-white p-6 hover:border-primary focus-visible:outline-primary"><p className="text-xs text-slate-500">{t.status === "active" ? "Activa" : t.status === "paused" ? "Pausada" : "Archivada"}</p><h2 className="mt-3 text-xl font-semibold">{t.name}</h2><p className="mt-2 text-sm text-primary">Abrir espacio →</p></Link>)}</div>{!tenants.length && <section className="mt-8 rounded-xl border border-dashed border-border p-8"><h2 className="font-semibold">Aún no tienes una barbería asignada</h2><p className="mt-2 text-sm text-slate-500">Tu cuenta está autenticada. Solicita al administrador una membresía activa para acceder.</p></section>}</main>;
}

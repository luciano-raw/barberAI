import Link from "next/link";
import { Button } from "@/components/ui/button";
import { listPlatformTenants } from "@/modules/platform/service";
import { changeTenantStatus, createTenant } from "./actions";

const labels = { active: "Activa", paused: "Pausada", archived: "Archivada" };
const messages = new Map([
  ["creada", "Barbería creada en estado pausado."],
  ["estado", "Estado actualizado."],
  ["datos", "Revisa los datos del formulario."],
  ["responsable", "El responsable debe tener una cuenta de Supabase Auth."],
  ["conflicto", "El estado cambió. Revisa el estado actual antes de continuar."],
  ["error", "No fue posible guardar el cambio."],
]);

export default async function AdministrationPage({
  searchParams,
}: {
  searchParams: Promise<{ resultado?: string }>;
}) {
  const tenants = await listPlatformTenants();
  const { resultado } = await searchParams;
  const message = messages.get(resultado ?? "");

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-6 py-12">
      <Link href="/panel" className="text-sm text-primary underline">Volver al panel</Link>
      <h1 className="text-3xl font-semibold">Administración de barberías</h1>
      {message && <p role="status" className="rounded-lg border p-4">{message}</p>}
      <form action={createTenant} className="grid gap-4 rounded-xl border bg-white p-6">
        <h2 className="text-lg font-semibold">Nueva barbería</h2>
        <label className="grid gap-1">
          Nombre
          <input name="name" required maxLength={120} className="rounded-md border px-3 py-2" />
        </label>
        <label className="grid gap-1">
          UUID del propietario
          <input name="owner" required maxLength={36} className="rounded-md border px-3 py-2" />
        </label>
        <Button className="justify-self-start">Crear barbería</Button>
      </form>
      <section className="space-y-3" aria-label="Barberías registradas">
        {tenants.length === 0 && <p>Aún no hay barberías registradas.</p>}
        {tenants.map(tenant => (
          <article key={tenant.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-white p-4">
            <div>
              <h2 className="font-semibold">{tenant.name}</h2>
              <p className="text-sm text-slate-600">{labels[tenant.status]}</p>
            </div>
            {tenant.status !== "archived" && (
              <form action={changeTenantStatus}>
                <input type="hidden" name="id" value={tenant.id} />
                <input type="hidden" name="expected" value={tenant.status} />
                <Button variant="outline" name="status" value={tenant.status === "paused" ? "active" : "paused"}>
                  {tenant.status === "paused" ? "Activar" : "Pausar"}
                </Button>
              </form>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}

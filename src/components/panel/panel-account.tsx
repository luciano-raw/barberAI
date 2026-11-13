import { signOut } from "@/app/ingresar/actions";
import { Button } from "@/components/ui/button";

export function PanelAccount({ email, role }: { email?: string; role: string }) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-3">
      <div className="min-w-0 break-all text-sm">
        <p className="font-medium">{email ?? "Cuenta autenticada"}</p>
        <p className="text-xs text-slate-600">{role}</p>
      </div>
      <form action={signOut}>
        <Button variant="outline" size="sm">Cerrar sesión</Button>
      </form>
    </div>
  );
}

export const memberRoleLabels = {
  owner: "Propietario",
  manager: "Encargado",
  barber: "Barbero",
};

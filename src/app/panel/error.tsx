"use client";
import { Button } from "@/components/ui/button";
export default function PanelError({ reset }: { reset: () => void }) {
  return <main className="mx-auto max-w-xl px-6 py-20"><h1 className="text-2xl font-semibold">No pudimos cargar tu espacio</h1><p className="my-5 text-sm leading-6 text-slate-600">Revisa tu conexión y vuelve a intentarlo. Si el problema continúa, pide al administrador revisar la configuración de acceso y la base de datos.</p><Button onClick={reset}>Reintentar</Button></main>;
}

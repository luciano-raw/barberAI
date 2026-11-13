import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-lg space-y-4 px-6 py-20">
      <h1 className="text-2xl font-semibold">Página no disponible</h1>
      <p className="text-slate-600">Vuelve al panel para abrir una sección disponible para tu cuenta.</p>
      <Link href="/panel" className="inline-block font-medium text-primary underline">Volver al panel</Link>
    </main>
  );
}

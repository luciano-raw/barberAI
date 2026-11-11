"use client";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "./actions";
export function LoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(signIn, { error: "" });
  return <form action={action} className="mt-8 space-y-5">
    <div><label htmlFor="email" className="text-sm font-medium">Correo electrónico</label><input id="email" name="email" type="email" autoComplete="username" required maxLength={254} className="mt-2 h-12 w-full rounded-lg border border-border bg-white px-4 focus-visible:outline-primary" placeholder="tu@barberia.cl" /></div>
    <div><label htmlFor="password" className="text-sm font-medium">Contraseña</label><input id="password" name="password" type="password" autoComplete="current-password" required maxLength={256} className="mt-2 h-12 w-full rounded-lg border border-border bg-white px-4 focus-visible:outline-primary" /></div>
    <p role="status" aria-live="polite" className="text-sm text-red-700">{state.error}</p>
    {!configured && <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">La conexión aún no está lista. Falta la clave publicable de Supabase en .env.local.</p>}
    <Button type="submit" disabled={pending || !configured} className="w-full">{pending ? "Ingresando…" : "Ingresar al panel"}</Button>
    <p className="text-xs leading-5 text-slate-500">Acceso para el equipo de la barbería. Solicita tu cuenta al administrador.</p>
  </form>;
}

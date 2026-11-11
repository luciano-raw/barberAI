import Link from "next/link";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { LoginForm } from "./login-form";
export const dynamic = "force-dynamic";
export default function LoginPage() {
  return <main className="grid min-h-screen lg:grid-cols-2"><section className="hidden flex-col justify-between bg-primary p-14 text-white lg:flex"><Link href="/" className="text-2xl font-bold">BarberAI</Link><div><p className="text-xs uppercase tracking-[.2em] text-emerald-200">Menos administración. Más barbería.</p><h1 className="mt-5 max-w-lg text-5xl font-semibold leading-tight">Un espacio para ordenar tu día.</h1><p className="mt-6 max-w-md leading-7 text-emerald-100">Tu equipo, tu agenda y la información que necesitas para gestionar con tranquilidad.</p></div><p className="text-sm text-emerald-100">Gestión para barberías · Chile</p></section><section className="flex items-center justify-center px-6 py-12"><div className="w-full max-w-sm"><Link href="/" className="text-xl font-bold text-primary lg:hidden">BarberAI</Link><p className="mt-8 text-xs font-semibold uppercase tracking-widest text-primary">Bienvenido a tu espacio</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">Inicia sesión</h2><p className="mt-3 text-sm text-slate-500">Ingresa con tu cuenta de trabajo.</p><LoginForm configured={!!getSupabaseConfig()} /></div></section></main>;
}

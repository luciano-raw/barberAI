import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "BarberAI | Gestión para barberías", description: "Plataforma de gestión para barberías" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es-CL"><body>{children}</body></html>;
}

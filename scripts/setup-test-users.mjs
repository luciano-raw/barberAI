import { loadEnvFile } from "node:process";
import { randomBytes, randomUUID } from "node:crypto";
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

loadEnvFile(".env.local");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
if (!url || !secret) throw new Error("Falta configuración administrativa local.");
const options = { auth: { persistSession: false, autoRefreshToken: false } };
const admin = createClient(url, secret, options);
const path = ".local/test-accounts.json";
mkdirSync(".local", { recursive: true });
const definitions = [
  ["platform", "Administrador de plataforma", "admin"],
  ["ownerA", "Propietario A", "owner-a"],
  ["managerA", "Encargado A", "manager-a"],
  ["barberA", "Barbero A", "barber-a"],
  ["ownerB", "Propietario B", "owner-b"],
  ["unassigned", "Sin membresía", "unassigned"],
];
const state = existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : {
  projectUrl: url, seedId: randomUUID(), tenantA: randomUUID(), tenantB: randomUUID(), barberA: randomUUID(),
  accounts: definitions.map(([key, label, email]) => ({ key, label, email: `${email}@barberai-test.example.com`, password: randomBytes(24).toString("base64url") })),
};
if (state.projectUrl !== url) throw new Error("El archivo de cuentas pertenece a otro proyecto.");
const save = () => writeFileSync(path, JSON.stringify(state, null, 2), { mode: 0o600 });
function check(error, operation) {
  if (error) throw new Error(`${operation}: fallo de servicio (${error.status ?? error.code ?? "sin código"}).`);
}
save();
try {
  // Comprobar el esquema antes de crear cuentas.
  for (const table of ["tenants", "memberships", "platform_admins", "barbers"]) {
    const result = await admin.from(table).select("*").limit(0);
    check(result.error, `Verificar ${table}`);
  }
  const existing = [];
  for (let page = 1; ; page++) {
    const result = await admin.auth.admin.listUsers({ page, perPage: 100 });
    check(result.error, "Consultar usuarios");
    existing.push(...result.data.users);
    if (result.data.users.length < 100) break;
  }
  for (const account of state.accounts) {
    const found = existing.find(user => user.email === account.email);
    if (found) {
      if (found.app_metadata?.barberai_test_seed !== state.seedId) throw new Error("Ya existe una cuenta ajena a este conjunto de pruebas; no se modificó.");
      account.id = found.id;
    } else {
      const result = await admin.auth.admin.createUser({
        email: account.email, password: account.password, email_confirm: true,
        app_metadata: { barberai_test_seed: state.seedId },
        user_metadata: { display_name: account.label },
      });
      check(result.error, `Crear ${account.key}`);
      account.id = result.data.user.id;
    }
    save();
    console.log(`Cuenta preparada: ${account.label}`);
  }
  const id = key => state.accounts.find(a => a.key === key).id;
  const tenants = await admin.from("tenants").upsert([
    { id: state.tenantA, name: "Barbería de prueba A", status: "paused" },
    { id: state.tenantB, name: "Barbería de prueba B", status: "paused" },
  ], { onConflict: "id", ignoreDuplicates: true });
  check(tenants.error, "Preparar barberías");
  const memberships = await admin.from("memberships").upsert([
    { tenant_id: state.tenantA, user_id: id("ownerA"), role: "owner", active: true },
    { tenant_id: state.tenantA, user_id: id("managerA"), role: "manager", active: true },
    { tenant_id: state.tenantA, user_id: id("barberA"), role: "barber", active: true },
    { tenant_id: state.tenantB, user_id: id("ownerB"), role: "owner", active: true },
  ], { onConflict: "tenant_id,user_id", ignoreDuplicates: true });
  check(memberships.error, "Asignar membresías");
  check((await admin.from("platform_admins").upsert({ user_id: id("platform") }, { onConflict: "user_id", ignoreDuplicates: true })).error, "Asignar administrador");
  check((await admin.from("barbers").upsert({ id: state.barberA, tenant_id: state.tenantA, user_id: id("barberA"), name: "Barbero de prueba A", active: true }, { onConflict: "id", ignoreDuplicates: true })).error, "Asignar ficha de barbero");
  state.completed = true;
  save();
  console.log("Configuración terminada. Contraseñas disponibles solo en .local/test-accounts.json.");
} catch (error) {
  // No imprimir errores de proveedor que puedan contener datos sensibles.
  console.error(error.message);
  process.exitCode = 1;
}

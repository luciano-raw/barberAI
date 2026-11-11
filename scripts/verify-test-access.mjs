import { loadEnvFile } from "node:process";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";

loadEnvFile(".env.local");
const state = JSON.parse(readFileSync(".local/test-accounts.json", "utf8"));
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (state.projectUrl !== url || !state.completed) throw new Error("Fixtures incompletos o de otro proyecto.");
const expected = { ownerA: state.tenantA, managerA: state.tenantA, barberA: state.tenantA, ownerB: state.tenantB };
try {
  for (const account of state.accounts) {
    // Pruebas con clave publicable y JWT de usuario, nunca clave privilegiada.
    const client = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
    const login = await client.auth.signInWithPassword({ email: account.email, password: account.password });
    assert.equal(login.error, null, `Login: ${account.key}`);
    assert.equal(login.data.user.id, account.id);
    const user = await client.auth.getUser();
    assert.equal(user.error, null);
    assert.equal(user.data.user.id, account.id);
    const tenants = await client.from("tenants").select("id");
    assert.equal(tenants.error, null);
    assert.deepEqual(tenants.data.map(t => t.id), expected[account.key] ? [expected[account.key]] : []);
    const foreignTenant = expected[account.key] === state.tenantA ? state.tenantB : state.tenantA;
    const forbidden = await client.from("tenants").select("id").eq("id", foreignTenant);
    assert.equal(forbidden.error, null);
    assert.equal(forbidden.data.length, 0);
    if (account.key === "barberA") {
      const barbers = await client.from("barbers").select("id, user_id");
      assert.equal(barbers.error, null);
      assert.deepEqual(barbers.data, [{ id: state.barberA, user_id: account.id }]);
    }
    const logout = await client.auth.signOut({ scope: "local" });
    assert.equal(logout.error, null);
    console.log(`OK: ingreso, identidad, visibilidad de tenants y cierre — ${account.label}`);
  }
  console.log("6 cuentas verificadas. Esta comprobación no sustituye la matriz completa de RLS ni pruebas del navegador.");
} catch {
  console.error("Falló una comprobación de acceso. No se muestran tokens ni credenciales.");
  process.exitCode = 1;
}

import test from "node:test";
import assert from "node:assert/strict";
import { canReadSection } from "../src/modules/identity/permissions.ts";
import { loginSchema, membershipSchema } from "../src/modules/identity/schemas.ts";

test("política de lectura deniega clientes y auditoría al barbero", () => {
  assert.equal(canReadSection("barber", "clientes"), false);
  assert.equal(canReadSection("barber", "actividad"), false);
  assert.equal(canReadSection("barber", "agenda"), true);
});
test("propietario/encargado pueden consultar secciones conocidas, ninguna desconocida", () => {
  for (const role of ["owner", "manager"]) {
    assert.equal(canReadSection(role, "clientes"), true);
    assert.equal(canReadSection(role, "actividad"), true);
    assert.equal(canReadSection(role, "constructor"), false);
    assert.equal(canReadSection(role, "__proto__"), false);
  }
});
test("membresía rechaza roles privilegiados no reconocidos y tenant inválido", () => {
  assert.equal(membershipSchema.safeParse({ tenant_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", role: "superadmin" }).success, false);
  assert.equal(membershipSchema.safeParse({ tenant_id: "otro-tenant", role: "owner" }).success, false);
});
test("login valida entradas externas antes de llamar Auth", () => {
  for (const value of [{ email: "incorrecto", password: "pass" }, { email: "test@example.com", password: "" }, { email: "test@example.com", password: "x".repeat(257) }]) {
    assert.equal(loginSchema.safeParse(value).success, false);
  }
});

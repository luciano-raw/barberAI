begin;

create function public.is_platform_admin()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.platform_admins where user_id = (select auth.uid())
  );
$$;

create function public.platform_list_tenants()
returns table(id uuid, name text, status public.tenant_status)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.is_platform_admin() then
    raise insufficient_privilege using message = 'Acceso restringido';
  end if;
  return query select t.id, t.name, t.status from public.tenants t order by t.name, t.id;
end;
$$;

create function public.platform_create_tenant(p_name text, p_owner uuid)
returns uuid language plpgsql security definer set search_path = ''
as $$
declare
  new_id uuid;
begin
  if not public.is_platform_admin() then
    raise insufficient_privilege using message = 'Acceso restringido';
  end if;
  if p_owner is null or p_name is null or length(btrim(p_name)) not between 1 and 120 then
    raise invalid_parameter_value using message = 'Datos de barbería inválidos';
  end if;
  insert into public.tenants(name) values (btrim(p_name)) returning id into new_id;
  insert into public.memberships(tenant_id, user_id, role) values (new_id, p_owner, 'owner');
  insert into public.audit_events(tenant_id, actor_user_id, actor_type, action, entity_id, request_id)
    values (new_id, auth.uid(), 'human', 'tenant.created', new_id, gen_random_uuid());
  return new_id;
end;
$$;

create function public.platform_set_tenant_status(
  p_tenant uuid, p_expected public.tenant_status, p_status public.tenant_status
)
returns boolean language plpgsql security definer set search_path = ''
as $$
begin
  if not public.is_platform_admin() then
    raise insufficient_privilege using message = 'Acceso restringido';
  end if;
  if not coalesce(
    (p_expected = 'active' and p_status in ('paused', 'archived'))
    or (p_expected = 'paused' and p_status in ('active', 'archived')), false
  ) then
    raise invalid_parameter_value using message = 'Transición inválida';
  end if;
  update public.tenants set status = p_status where id = p_tenant and status = p_expected;
  if not found then return false; end if;
  insert into public.audit_events(tenant_id, actor_user_id, actor_type, action, entity_id, request_id)
    values (p_tenant, auth.uid(), 'human', 'tenant.status.' || p_status::text, p_tenant, gen_random_uuid());
  return true;
end;
$$;

revoke all on function public.is_platform_admin(), public.platform_list_tenants(),
  public.platform_create_tenant(text, uuid),
  public.platform_set_tenant_status(uuid, public.tenant_status, public.tenant_status)
from public, anon, authenticated;
grant execute on function public.is_platform_admin(), public.platform_list_tenants(),
  public.platform_create_tenant(text, uuid),
  public.platform_set_tenant_status(uuid, public.tenant_status, public.tenant_status)
to authenticated;

commit;

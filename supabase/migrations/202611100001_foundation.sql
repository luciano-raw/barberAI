-- BORRADOR inicial. Ejecutar manualmente solo en un proyecto de desarrollo.
begin;
create schema if not exists extensions;
create extension if not exists btree_gist with schema extensions;
set local search_path = public, extensions;
create schema if not exists private;
revoke all on schema private from public;

create type public.tenant_status as enum ('active', 'paused', 'archived');
create type public.member_role as enum ('owner', 'manager', 'barber');
create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 1 and 120),
  status public.tenant_status not null default 'paused',
  timezone text not null default 'America/Santiago' check (timezone = 'America/Santiago'),
  created_at timestamptz not null default now()
);
-- No acceso directo desde la API: administración de plataforma en próxima etapa.
create table public.platform_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
create table public.memberships (
  tenant_id uuid not null references public.tenants(id),
  user_id uuid not null references auth.users(id),
  role public.member_role not null,
  active boolean not null default true,
  primary key (tenant_id, user_id)
);
create index memberships_user_idx on public.memberships(user_id, tenant_id);

create function private.has_role(target uuid, allowed public.member_role[])
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.memberships m
    where m.tenant_id = target and m.user_id = (select auth.uid())
      and m.active and m.role = any(allowed));
$$;
revoke all on function private.has_role(uuid, public.member_role[]) from public;
grant usage on schema private to authenticated;
grant execute on function private.has_role(uuid, public.member_role[]) to authenticated;

create table public.barbers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id),
  user_id uuid,
  name text not null,
  active boolean not null default true,
  unique (tenant_id, id),
  foreign key (tenant_id, user_id) references public.memberships(tenant_id, user_id)
);
create table public.services (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id),
  name text not null,
  duration_minutes integer not null check (duration_minutes > 0),
  price_clp integer not null check (price_clp >= 0),
  active boolean not null default true,
  unique (tenant_id, id)
);
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id),
  name text,
  phone_e164 text not null check (phone_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  created_at timestamptz not null default now(),
  unique (tenant_id, id), unique (tenant_id, phone_e164)
);
-- Reservas y bloqueos comparten tabla para impedir cruces entre ambos.
create table public.calendar_entries (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id),
  barber_id uuid not null,
  customer_id uuid,
  service_id uuid,
  kind text not null check (kind in ('booking', 'block')),
  status text not null default 'confirmed' check (status in ('confirmed', 'completed', 'cancelled', 'no_show')),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (tenant_id, id),
  check (ends_at > starts_at),
  check ((kind = 'booking' and customer_id is not null and service_id is not null)
     or (kind = 'block' and customer_id is null and service_id is null)),
  foreign key (tenant_id, barber_id) references public.barbers(tenant_id, id),
  foreign key (tenant_id, customer_id) references public.customers(tenant_id, id),
  foreign key (tenant_id, service_id) references public.services(tenant_id, id),
  exclude using gist (tenant_id with =, barber_id with =, tstzrange(starts_at, ends_at, '[)') with &&)
    where (status <> 'cancelled')
);
create index calendar_tenant_start_idx on public.calendar_entries(tenant_id, starts_at);
create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id),
  actor_user_id uuid references auth.users(id),
  actor_type text not null check (actor_type in ('human', 'agent', 'system')),
  action text not null,
  entity_id uuid,
  request_id uuid not null,
  created_at timestamptz not null default now()
);
create index audit_tenant_created_idx on public.audit_events(tenant_id, created_at);

-- Denegación por defecto: por ahora solo lecturas autorizadas, ninguna escritura API.
alter table public.tenants enable row level security;
alter table public.platform_admins enable row level security;
alter table public.memberships enable row level security;
alter table public.barbers enable row level security;
alter table public.services enable row level security;
alter table public.customers enable row level security;
alter table public.calendar_entries enable row level security;
alter table public.audit_events enable row level security;
revoke all on public.tenants, public.platform_admins, public.memberships, public.barbers,
  public.services, public.customers, public.calendar_entries, public.audit_events from anon, authenticated;
grant select on public.tenants, public.memberships, public.barbers, public.services,
  public.customers, public.calendar_entries, public.audit_events to authenticated;

create policy tenant_read on public.tenants for select to authenticated
  using (private.has_role(id, array['owner','manager','barber']::public.member_role[]));
create policy membership_read on public.memberships for select to authenticated
  using (user_id = (select auth.uid()) or private.has_role(tenant_id, array['owner','manager']::public.member_role[]));
create policy barber_read on public.barbers for select to authenticated
  using (private.has_role(tenant_id, array['owner','manager']::public.member_role[]) or
    (user_id = (select auth.uid()) and private.has_role(tenant_id, array['barber']::public.member_role[])));
create policy service_read on public.services for select to authenticated
  using (private.has_role(tenant_id, array['owner','manager','barber']::public.member_role[]));
create policy customer_read on public.customers for select to authenticated
  using (private.has_role(tenant_id, array['owner','manager']::public.member_role[]));
create policy calendar_read on public.calendar_entries for select to authenticated
  using (private.has_role(tenant_id, array['owner','manager']::public.member_role[]) or
    (private.has_role(tenant_id, array['barber']::public.member_role[]) and exists
      (select 1 from public.barbers b where b.tenant_id = calendar_entries.tenant_id
        and b.id = calendar_entries.barber_id and b.user_id = (select auth.uid()))));
create policy audit_read on public.audit_events for select to authenticated
  using (private.has_role(tenant_id, array['owner','manager']::public.member_role[]));
commit;

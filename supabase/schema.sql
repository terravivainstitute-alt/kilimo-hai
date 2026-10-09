-- ============================================================
-- Kilimo Hai: muundo kamili wa database (hali ya sasa)
-- Tumia kujenga upya project mpya ya Supabase, kisha rejesha data
-- kutoka kwenye nakala rudufu (JSON). Angalia "Kurejesha" kwenye README.
-- ============================================================

create extension if not exists "uuid-ossp";

-- ---------- Majedwali ----------
create table if not exists public.services (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name jsonb not null,
  description jsonb not null,
  packages jsonb,
  icon text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default uuid_generate_v4(),
  farmer_name text not null,
  phone text not null,
  region text,
  district text,
  farm_size_acres numeric,
  crop text,
  service_id uuid references public.services(id) on delete set null,
  package_name text,
  notes text,
  photo_urls text[],
  status text not null default 'pending' check (status in ('pending','confirmed','in_progress','done','cancelled')),
  amount numeric,
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid','paid','failed')),
  payment_provider text,
  payment_reference text,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name jsonb not null,
  description jsonb,
  category text not null check (category in ('fertilizer','pesticide','other')),
  price numeric not null,
  unit text not null default 'kg',
  stock int not null default 0,
  image_url text,
  videos jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  customer_name text not null,
  phone text not null,
  region text,
  items jsonb not null,
  total_amount numeric not null,
  status text not null default 'pending' check (status in ('pending','confirmed','shipped','delivered','cancelled')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid','paid','failed')),
  payment_provider text,
  payment_reference text,
  created_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title jsonb not null,
  body jsonb not null,
  cover_image_url text,
  videos jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  title jsonb not null,
  description jsonb,
  event_date date,
  photos jsonb not null default '[]'::jsonb,
  videos jsonb not null default '[]'::jsonb,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.site_content (
  key text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.admins (email text primary key);

-- ---------- Admin ----------
create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
$$;

-- ---------- Usalama (RLS) ----------
alter table public.services enable row level security;
alter table public.bookings enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.blog_posts enable row level security;
alter table public.events enable row level security;
alter table public.site_content enable row level security;
alter table public.admins enable row level security;

create policy "public read services" on public.services for select using (is_active = true);
create policy "public read products" on public.products for select using (is_active = true);
create policy "public read blog" on public.blog_posts for select using (published = true);
create policy "public read events" on public.events for select using (is_published = true);
create policy "public read content" on public.site_content for select using (true);
create policy "public insert bookings" on public.bookings for insert with check (true);

create policy "admin manage services" on public.services for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin manage bookings" on public.bookings for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin manage products" on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin manage orders" on public.orders for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin manage blog" on public.blog_posts for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin manage events" on public.events for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin manage content" on public.site_content for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- Kuweka oda (bei zinasomwa kutoka database) ----------
create or replace function public.place_order(
  p_name text, p_phone text, p_region text, p_items jsonb
) returns jsonb
language plpgsql security definer
set search_path = public
as $$
declare
  v_item jsonb;
  v_prod record;
  v_qty int;
  v_total numeric := 0;
  v_lines jsonb := '[]'::jsonb;
  v_id uuid;
begin
  if coalesce(trim(p_name), '') = '' or coalesce(trim(p_phone), '') = '' then
    raise exception 'name_phone_required';
  end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'empty_cart';
  end if;
  if jsonb_array_length(p_items) > 50 then
    raise exception 'too_many_items';
  end if;

  for v_item in select * from jsonb_array_elements(p_items) loop
    v_qty := coalesce((v_item ->> 'qty')::int, 0);
    if v_qty < 1 or v_qty > 1000 then
      raise exception 'bad_qty';
    end if;

    select id, name, price, unit, stock into v_prod
    from public.products
    where id = (v_item ->> 'product_id')::uuid and is_active = true;

    if not found then
      raise exception 'product_unavailable';
    end if;
    if v_prod.stock < v_qty then
      raise exception 'out_of_stock';
    end if;

    v_total := v_total + v_prod.price * v_qty;
    v_lines := v_lines || jsonb_build_array(jsonb_build_object(
      'product_id', v_prod.id,
      'name', v_prod.name ->> 'sw',
      'name_en', v_prod.name ->> 'en',
      'unit', v_prod.unit,
      'qty', v_qty,
      'price', v_prod.price
    ));
  end loop;

  insert into public.orders (customer_name, phone, region, items, total_amount)
  values (trim(p_name), trim(p_phone), nullif(trim(coalesce(p_region, '')), ''), v_lines, v_total)
  returning id into v_id;

  return jsonb_build_object('id', v_id, 'total', v_total);
end;
$$;
grant execute on function public.place_order(text, text, text, jsonb) to anon, authenticated;

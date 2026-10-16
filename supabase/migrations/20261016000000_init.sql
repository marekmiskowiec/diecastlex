-- Katalog modeli: czytelny dla wszystkich zalogowanych, zapis tylko przez service_role (import).
create table public.models (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  series text,
  year int,
  color text,
  toy_number text,
  image_url text,
  created_at timestamptz not null default now()
);
create extension if not exists pg_trgm;
create index models_name_trgm on public.models using gin (name gin_trgm_ops);
create index models_toy_number on public.models (toy_number);

create table public.collection_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  model_id uuid not null references public.models on delete restrict,
  condition text not null default 'mint' check (condition in ('mint','good','fair','poor')),
  quantity int not null default 1 check (quantity >= 1),
  price_paid numeric(10,2),
  notes text,
  photo_path text,
  created_at timestamptz not null default now()
);
create index collection_items_user on public.collection_items (user_id);

create table public.wishlist (
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  model_id uuid not null references public.models on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, model_id)
);

alter table public.models enable row level security;
alter table public.collection_items enable row level security;
alter table public.wishlist enable row level security;

create policy "models readable by signed-in users" on public.models
  for select to authenticated using (true);

create policy "own collection" on public.collection_items
  for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "own wishlist" on public.wishlist
  for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Zdjęcia: prywatny bucket, pliki w folderze o nazwie user_id.
insert into storage.buckets (id, name, public) values ('item-photos', 'item-photos', false);

create policy "own photos" on storage.objects
  for all to authenticated
  using (bucket_id = 'item-photos' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'item-photos' and (storage.foldername(name))[1] = auth.uid()::text);

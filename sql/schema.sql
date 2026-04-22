-- Student Connect / Supabase schema
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  campus text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  price numeric(10,2) not null default 0,
  category text not null,
  campus text not null,
  condition text not null default 'Bon état',
  status text not null default 'active' check (status in ('active', 'reserved', 'sold')),
  created_at timestamptz not null default now()
);

create table if not exists public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  image_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, listing_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid references public.listings(id) on delete set null,
  content text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index if not exists idx_listings_created_at on public.listings(created_at desc);
create index if not exists idx_listings_category on public.listings(category);
create index if not exists idx_listings_campus on public.listings(campus);
create index if not exists idx_favorites_user_id on public.favorites(user_id);
create index if not exists idx_messages_sender_receiver on public.messages(sender_id, receiver_id);

alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;
alter table public.favorites enable row level security;
alter table public.messages enable row level security;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, full_name, email, campus)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'campus', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Profiles
create policy "Profiles are viewable by everyone"
on public.profiles for select
using (true);

create policy "Users can update their own profile"
on public.profiles for update
using (auth.uid() = id);

create policy "Users can insert their own profile"
on public.profiles for insert
with check (auth.uid() = id);

-- Listings
create policy "Listings are readable by everyone"
on public.listings for select
using (true);

create policy "Authenticated users can create listings"
on public.listings for insert
with check (auth.uid() = user_id);

create policy "Users can update their own listings"
on public.listings for update
using (auth.uid() = user_id);

create policy "Users can delete their own listings"
on public.listings for delete
using (auth.uid() = user_id);

-- Listing images
create policy "Listing images are readable by everyone"
on public.listing_images for select
using (true);

create policy "Users can insert images for their listings"
on public.listing_images for insert
with check (
  exists (
    select 1 from public.listings l
    where l.id = listing_id and l.user_id = auth.uid()
  )
);

create policy "Users can manage images for their listings"
on public.listing_images for update
using (
  exists (
    select 1 from public.listings l
    where l.id = listing_id and l.user_id = auth.uid()
  )
);

create policy "Users can delete images for their listings"
on public.listing_images for delete
using (
  exists (
    select 1 from public.listings l
    where l.id = listing_id and l.user_id = auth.uid()
  )
);

-- Favorites
create policy "Users can read their own favorites"
on public.favorites for select
using (auth.uid() = user_id);

create policy "Users can manage their own favorites"
on public.favorites for insert
with check (auth.uid() = user_id);

create policy "Users can delete their own favorites"
on public.favorites for delete
using (auth.uid() = user_id);

-- Messages
create policy "Users can read their own messages"
on public.messages for select
using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can send messages as themselves"
on public.messages for insert
with check (auth.uid() = sender_id);

create policy "Users can update their received messages"
on public.messages for update
using (auth.uid() = receiver_id);

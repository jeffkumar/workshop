-- profiles table (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users primary key,
  username text unique,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- updates table
create table updates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row Level Security
alter table profiles enable row level security;
alter table updates enable row level security;

create policy "Public profiles" on profiles for select using (true);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

create policy "Anyone can read updates" on updates for select using (true);
create policy "Users can create own updates" on updates for insert with check (auth.uid() = user_id);
create policy "Users can update own updates" on updates for update using (auth.uid() = user_id);
create policy "Users can delete own updates" on updates for delete using (auth.uid() = user_id);

-- Function to auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

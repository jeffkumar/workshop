-- likes table
create table likes (
  update_id uuid references updates(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  primary key (update_id, user_id)
);

-- Row Level Security
alter table likes enable row level security;

create policy "Anyone can read likes" on likes for select using (true);
create policy "Users can like" on likes for insert with check (auth.uid() = user_id);
create policy "Users can unlike" on likes for delete using (auth.uid() = user_id);

-- Create savings goals table
create table if not exists public.savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_name text not null,
  target_amount numeric(12, 2) not null,
  current_amount numeric(12, 2) default 0,
  deadline date,
  category text,
  is_completed boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.savings_goals enable row level security;

create policy "savings_goals_select_own"
  on public.savings_goals for select
  using (auth.uid() = user_id);

create policy "savings_goals_insert_own"
  on public.savings_goals for insert
  with check (auth.uid() = user_id);

create policy "savings_goals_update_own"
  on public.savings_goals for update
  using (auth.uid() = user_id);

create policy "savings_goals_delete_own"
  on public.savings_goals for delete
  using (auth.uid() = user_id);

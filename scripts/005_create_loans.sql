-- Create loans table for loan management
create table if not exists public.loans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  principal_amount numeric(12, 2) not null,
  interest_rate numeric(5, 2) not null,
  tenure_months integer not null,
  emi_amount numeric(10, 2) not null,
  status text check (status in ('applied', 'approved', 'rejected', 'active', 'completed', 'defaulted')),
  risk_score integer,
  purpose text,
  disbursed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.loans enable row level security;

create policy "loans_select_own"
  on public.loans for select
  using (auth.uid() = user_id);

create policy "loans_insert_own"
  on public.loans for insert
  with check (auth.uid() = user_id);

create policy "loans_update_own"
  on public.loans for update
  using (auth.uid() = user_id);

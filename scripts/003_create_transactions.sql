-- Create transactions table for tracking all financial movements
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid references public.accounts(id) on delete set null,
  amount numeric(12, 2) not null,
  transaction_type text check (transaction_type in ('income', 'expense', 'transfer', 'loan_disbursement', 'loan_payment')),
  category text,
  merchant_name text,
  description text,
  status text check (status in ('pending', 'completed', 'failed')),
  transaction_date timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

alter table public.transactions enable row level security;

create policy "transactions_select_own"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "transactions_insert_own"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "transactions_update_own"
  on public.transactions for update
  using (auth.uid() = user_id);

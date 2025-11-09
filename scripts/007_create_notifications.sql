-- Create notifications table
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  notification_type text check (notification_type in ('payment_due', 'loan_status', 'budget_alert', 'transaction_alert', 'offer', 'system')),
  title text not null,
  message text,
  is_read boolean default false,
  read_at timestamp with time zone,
  channels text array default array['in_app'],
  created_at timestamp with time zone default now()
);

alter table public.notifications enable row level security;

create policy "notifications_select_own"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "notifications_insert_system"
  on public.notifications for insert
  with check (true);

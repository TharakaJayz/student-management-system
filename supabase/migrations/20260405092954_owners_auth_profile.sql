-- Owners.id must match auth.users.id (no random default). Tighten RLS + unique mobile.

alter table public.owners alter column id drop default;

alter table public.owners
  add constraint owners_id_fkey foreign key (id) references auth.users (id) on delete cascade;

create unique index owners_mobile_key on public.owners (mobile);

drop policy if exists "owners_select_authenticated" on public.owners;
drop policy if exists "owners_insert_authenticated" on public.owners;
drop policy if exists "owners_update_authenticated" on public.owners;
drop policy if exists "owners_delete_authenticated" on public.owners;

create policy "owners_select_own"
  on public.owners for select to authenticated using (id = (select auth.uid()));

create policy "owners_insert_own"
  on public.owners for insert to authenticated with check (id = (select auth.uid()));

create policy "owners_update_own"
  on public.owners for update to authenticated using (id = (select auth.uid()))
  with check (id = (select auth.uid()));
-- Enforce: one owner can have only one institute

-- 1) Optional pre-check (will help debugging if migration fails)
-- select owner_id, count(*) as cnt
-- from public.institutes
-- group by owner_id
-- having count(*) > 1;

-- 2) Add uniqueness rule
alter table public.institutes
  add constraint institutes_owner_id_unique unique (owner_id);
-- =============================================================================
-- ClassRoom, Subject (matches example_types.ts ClassRoom, Subject)
-- =============================================================================

create table public.class_rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  institute_id uuid not null references public.institutes (id) on delete cascade,
  location text not null,
  capacity integer not null check (capacity >= 0),
  is_air_conditioned boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint class_rooms_institute_name_unique unique (institute_id, name)
);

create index class_rooms_institute_id_idx on public.class_rooms (institute_id);

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  medium text not null check (medium in ('ENGLISH', 'SINHALA')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint subjects_name_medium_unique unique (name, medium)
);

-- -----------------------------------------------------------------------------
-- updated_at triggers
-- -----------------------------------------------------------------------------

create trigger class_rooms_set_updated_at
  before update on public.class_rooms
  for each row execute function public.set_updated_at();

create trigger subjects_set_updated_at
  before update on public.subjects
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------

alter table public.class_rooms enable row level security;
alter table public.subjects enable row level security;

create policy "class_rooms_select_authenticated"
  on public.class_rooms for select to authenticated using (true);
create policy "class_rooms_insert_authenticated"
  on public.class_rooms for insert to authenticated with check (true);
create policy "class_rooms_update_authenticated"
  on public.class_rooms for update to authenticated using (true) with check (true);
create policy "class_rooms_delete_authenticated"
  on public.class_rooms for delete to authenticated using (true);

create policy "subjects_select_authenticated"
  on public.subjects for select to authenticated using (true);
create policy "subjects_insert_authenticated"
  on public.subjects for insert to authenticated with check (true);
create policy "subjects_update_authenticated"
  on public.subjects for update to authenticated using (true) with check (true);
create policy "subjects_delete_authenticated"
  on public.subjects for delete to authenticated using (true);

-- =============================================================================
-- Baseline: owners, institutes, students, student_institute_enrollments
-- Matches example_types.ts (Institute, Student, Owner, Student_institute_enrollments)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tables (order: owners -> institutes -> students -> enrollments)
-- -----------------------------------------------------------------------------

create table public.owners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  mobile text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.institutes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  owner_id uuid not null references public.owners (id) on delete restrict,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index institutes_owner_id_idx on public.institutes (owner_id);

create table public.students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  age integer not null check (age >= 0 and age <= 150),
  image_url text not null default '',
  grade text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.student_institute_enrollments (
  student_id uuid not null references public.students (id) on delete cascade,
  institute_id uuid not null references public.institutes (id) on delete cascade,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (student_id, institute_id)
);

create index student_institute_enrollments_institute_id_idx
  on public.student_institute_enrollments (institute_id);

-- -----------------------------------------------------------------------------
-- updated_at trigger (fixed search_path for Supabase linter)
-- -----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger owners_set_updated_at
  before update on public.owners
  for each row execute function public.set_updated_at();

create trigger institutes_set_updated_at
  before update on public.institutes
  for each row execute function public.set_updated_at();

create trigger students_set_updated_at
  before update on public.students
  for each row execute function public.set_updated_at();

create trigger student_institute_enrollments_set_updated_at
  before update on public.student_institute_enrollments
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Row Level Security (starter: authenticated full access — tighten later)
-- -----------------------------------------------------------------------------

alter table public.owners enable row level security;
alter table public.institutes enable row level security;
alter table public.students enable row level security;
alter table public.student_institute_enrollments enable row level security;

-- owners
create policy "owners_select_authenticated"
  on public.owners for select to authenticated using (true);
create policy "owners_insert_authenticated"
  on public.owners for insert to authenticated with check (true);
create policy "owners_update_authenticated"
  on public.owners for update to authenticated using (true) with check (true);
create policy "owners_delete_authenticated"
  on public.owners for delete to authenticated using (true);

-- institutes
create policy "institutes_select_authenticated"
  on public.institutes for select to authenticated using (true);
create policy "institutes_insert_authenticated"
  on public.institutes for insert to authenticated with check (true);
create policy "institutes_update_authenticated"
  on public.institutes for update to authenticated using (true) with check (true);
create policy "institutes_delete_authenticated"
  on public.institutes for delete to authenticated using (true);

-- students
create policy "students_select_authenticated"
  on public.students for select to authenticated using (true);
create policy "students_insert_authenticated"
  on public.students for insert to authenticated with check (true);
create policy "students_update_authenticated"
  on public.students for update to authenticated using (true) with check (true);
create policy "students_delete_authenticated"
  on public.students for delete to authenticated using (true);

-- enrollments
create policy "enrollments_select_authenticated"
  on public.student_institute_enrollments for select to authenticated using (true);
create policy "enrollments_insert_authenticated"
  on public.student_institute_enrollments for insert to authenticated with check (true);
create policy "enrollments_update_authenticated"
  on public.student_institute_enrollments for update to authenticated using (true) with check (true);
create policy "enrollments_delete_authenticated"
  on public.student_institute_enrollments for delete to authenticated using (true);
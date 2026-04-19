-- =============================================================================
-- Teacher, Teacher_Subject, Class, Student_Class, Student_subject,
-- Student_class_attendances, Student_class_monthly_payments,
-- Teacher_class_monthly_payments, Teacher_institute_assignments
-- Matches example_types.ts (snake_case columns)
-- Prerequisites: owners, institutes, students, class_rooms, subjects (prior migrations)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- teachers (Teacher + BaseDomain)
-- -----------------------------------------------------------------------------

create table public.teachers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  mobile text not null,
  subject_id uuid not null references public.subjects (id) on delete restrict,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index teachers_subject_id_idx on public.teachers (subject_id);

-- -----------------------------------------------------------------------------
-- teacher_subjects (many-to-many; Teacher_Subject)
-- -----------------------------------------------------------------------------

create table public.teacher_subjects (
  teacher_id uuid not null references public.teachers (id) on delete cascade,
  subject_id uuid not null references public.subjects (id) on delete cascade,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (teacher_id, subject_id)
);

create index teacher_subjects_subject_id_idx on public.teacher_subjects (subject_id);

-- -----------------------------------------------------------------------------
-- teacher_institute_assignments (Teacher_institute_assignments)
-- -----------------------------------------------------------------------------

create table public.teacher_institute_assignments (
  teacher_id uuid not null references public.teachers (id) on delete cascade,
  institute_id uuid not null references public.institutes (id) on delete cascade,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (teacher_id, institute_id)
);

create index teacher_institute_assignments_institute_id_idx
  on public.teacher_institute_assignments (institute_id);

-- -----------------------------------------------------------------------------
-- classes (Class + BaseDomain)
-- -----------------------------------------------------------------------------

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  class_room_id uuid not null references public.class_rooms (id) on delete restrict,
  institute_id uuid not null references public.institutes (id) on delete cascade,
  teacher_id uuid not null references public.teachers (id) on delete restrict,
  subject_id uuid not null references public.subjects (id) on delete restrict,
  grade text not null,
  start_time bigint not null,
  end_time bigint not null,
  frequency text not null check (frequency in ('WEEKLY', 'OTHER')),
  day text not null check (
    day in (
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
      'SUNDAY'
    )
  ),
  class_fee numeric(14, 2) not null check (class_fee >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index classes_institute_id_idx on public.classes (institute_id);
create index classes_teacher_id_idx on public.classes (teacher_id);
create index classes_subject_id_idx on public.classes (subject_id);
create index classes_class_room_id_idx on public.classes (class_room_id);

-- -----------------------------------------------------------------------------
-- student_classes (Student_Class)
-- -----------------------------------------------------------------------------

create table public.student_classes (
  student_id uuid not null references public.students (id) on delete cascade,
  class_id uuid not null references public.classes (id) on delete cascade,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (student_id, class_id)
);

create index student_classes_class_id_idx on public.student_classes (class_id);

-- -----------------------------------------------------------------------------
-- student_subjects (Student_subject)
-- -----------------------------------------------------------------------------

create table public.student_subjects (
  student_id uuid not null references public.students (id) on delete cascade,
  subject_id uuid not null references public.subjects (id) on delete cascade,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (student_id, subject_id)
);

create index student_subjects_subject_id_idx on public.student_subjects (subject_id);

-- -----------------------------------------------------------------------------
-- student_class_attendances (Student_class_attendances — no id; composite PK)
-- attendance_date: epoch ms or similar numeric from app (bigint)
-- -----------------------------------------------------------------------------

create table public.student_class_attendances (
  student_id uuid not null references public.students (id) on delete cascade,
  class_id uuid not null references public.classes (id) on delete cascade,
  attendance_date bigint not null,
  is_present boolean not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (student_id, class_id, attendance_date)
);

create index student_class_attendances_class_id_idx
  on public.student_class_attendances (class_id);

-- -----------------------------------------------------------------------------
-- student_class_monthly_payments (no id; composite PK)
-- -----------------------------------------------------------------------------

create table public.student_class_monthly_payments (
  billing_month text not null,
  student_id uuid not null references public.students (id) on delete cascade,
  grade text not null,
  class_id uuid not null references public.classes (id) on delete cascade,
  institute_id uuid not null references public.institutes (id) on delete cascade,
  amount_due numeric(14, 2) not null check (amount_due >= 0),
  payment_amount numeric(14, 2) not null check (payment_amount >= 0),
  payment_status text not null check (payment_status in ('PENDING', 'PAID', 'FAILED')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (billing_month, student_id, class_id)
);

create index student_class_monthly_payments_institute_id_idx
  on public.student_class_monthly_payments (institute_id);

-- -----------------------------------------------------------------------------
-- teacher_class_monthly_payments (no id; composite PK)
-- -----------------------------------------------------------------------------

create table public.teacher_class_monthly_payments (
  institute_id uuid not null references public.institutes (id) on delete cascade,
  teacher_id uuid not null references public.teachers (id) on delete cascade,
  class_id uuid not null references public.classes (id) on delete cascade,
  billing_month text not null,
  amount_due numeric(14, 2) not null check (amount_due >= 0),
  payment_amount numeric(14, 2) not null check (payment_amount >= 0),
  payment_status text not null check (payment_status in ('PENDING', 'PAID', 'FAILED')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (institute_id, teacher_id, class_id, billing_month)
);

-- -----------------------------------------------------------------------------
-- updated_at triggers
-- -----------------------------------------------------------------------------

create trigger teachers_set_updated_at
  before update on public.teachers
  for each row execute function public.set_updated_at();

create trigger teacher_subjects_set_updated_at
  before update on public.teacher_subjects
  for each row execute function public.set_updated_at();

create trigger teacher_institute_assignments_set_updated_at
  before update on public.teacher_institute_assignments
  for each row execute function public.set_updated_at();

create trigger classes_set_updated_at
  before update on public.classes
  for each row execute function public.set_updated_at();

create trigger student_classes_set_updated_at
  before update on public.student_classes
  for each row execute function public.set_updated_at();

create trigger student_subjects_set_updated_at
  before update on public.student_subjects
  for each row execute function public.set_updated_at();

create trigger student_class_attendances_set_updated_at
  before update on public.student_class_attendances
  for each row execute function public.set_updated_at();

create trigger student_class_monthly_payments_set_updated_at
  before update on public.student_class_monthly_payments
  for each row execute function public.set_updated_at();

create trigger teacher_class_monthly_payments_set_updated_at
  before update on public.teacher_class_monthly_payments
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Row Level Security (starter: authenticated full access — tighten later)
-- -----------------------------------------------------------------------------

alter table public.teachers enable row level security;
alter table public.teacher_subjects enable row level security;
alter table public.teacher_institute_assignments enable row level security;
alter table public.classes enable row level security;
alter table public.student_classes enable row level security;
alter table public.student_subjects enable row level security;
alter table public.student_class_attendances enable row level security;
alter table public.student_class_monthly_payments enable row level security;
alter table public.teacher_class_monthly_payments enable row level security;

-- teachers
create policy "teachers_select_authenticated"
  on public.teachers for select to authenticated using (true);
create policy "teachers_insert_authenticated"
  on public.teachers for insert to authenticated with check (true);
create policy "teachers_update_authenticated"
  on public.teachers for update to authenticated using (true) with check (true);
create policy "teachers_delete_authenticated"
  on public.teachers for delete to authenticated using (true);

-- teacher_subjects
create policy "teacher_subjects_select_authenticated"
  on public.teacher_subjects for select to authenticated using (true);
create policy "teacher_subjects_insert_authenticated"
  on public.teacher_subjects for insert to authenticated with check (true);
create policy "teacher_subjects_update_authenticated"
  on public.teacher_subjects for update to authenticated using (true) with check (true);
create policy "teacher_subjects_delete_authenticated"
  on public.teacher_subjects for delete to authenticated using (true);

-- teacher_institute_assignments
create policy "teacher_institute_assignments_select_authenticated"
  on public.teacher_institute_assignments for select to authenticated using (true);
create policy "teacher_institute_assignments_insert_authenticated"
  on public.teacher_institute_assignments for insert to authenticated with check (true);
create policy "teacher_institute_assignments_update_authenticated"
  on public.teacher_institute_assignments for update to authenticated using (true) with check (true);
create policy "teacher_institute_assignments_delete_authenticated"
  on public.teacher_institute_assignments for delete to authenticated using (true);

-- classes
create policy "classes_select_authenticated"
  on public.classes for select to authenticated using (true);
create policy "classes_insert_authenticated"
  on public.classes for insert to authenticated with check (true);
create policy "classes_update_authenticated"
  on public.classes for update to authenticated using (true) with check (true);
create policy "classes_delete_authenticated"
  on public.classes for delete to authenticated using (true);

-- student_classes
create policy "student_classes_select_authenticated"
  on public.student_classes for select to authenticated using (true);
create policy "student_classes_insert_authenticated"
  on public.student_classes for insert to authenticated with check (true);
create policy "student_classes_update_authenticated"
  on public.student_classes for update to authenticated using (true) with check (true);
create policy "student_classes_delete_authenticated"
  on public.student_classes for delete to authenticated using (true);

-- student_subjects
create policy "student_subjects_select_authenticated"
  on public.student_subjects for select to authenticated using (true);
create policy "student_subjects_insert_authenticated"
  on public.student_subjects for insert to authenticated with check (true);
create policy "student_subjects_update_authenticated"
  on public.student_subjects for update to authenticated using (true) with check (true);
create policy "student_subjects_delete_authenticated"
  on public.student_subjects for delete to authenticated using (true);

-- student_class_attendances
create policy "student_class_attendances_select_authenticated"
  on public.student_class_attendances for select to authenticated using (true);
create policy "student_class_attendances_insert_authenticated"
  on public.student_class_attendances for insert to authenticated with check (true);
create policy "student_class_attendances_update_authenticated"
  on public.student_class_attendances for update to authenticated using (true) with check (true);
create policy "student_class_attendances_delete_authenticated"
  on public.student_class_attendances for delete to authenticated using (true);

-- student_class_monthly_payments
create policy "student_class_monthly_payments_select_authenticated"
  on public.student_class_monthly_payments for select to authenticated using (true);
create policy "student_class_monthly_payments_insert_authenticated"
  on public.student_class_monthly_payments for insert to authenticated with check (true);
create policy "student_class_monthly_payments_update_authenticated"
  on public.student_class_monthly_payments for update to authenticated using (true) with check (true);
create policy "student_class_monthly_payments_delete_authenticated"
  on public.student_class_monthly_payments for delete to authenticated using (true);

-- teacher_class_monthly_payments
create policy "teacher_class_monthly_payments_select_authenticated"
  on public.teacher_class_monthly_payments for select to authenticated using (true);
create policy "teacher_class_monthly_payments_insert_authenticated"
  on public.teacher_class_monthly_payments for insert to authenticated with check (true);
create policy "teacher_class_monthly_payments_update_authenticated"
  on public.teacher_class_monthly_payments for update to authenticated using (true) with check (true);
create policy "teacher_class_monthly_payments_delete_authenticated"
  on public.teacher_class_monthly_payments for delete to authenticated using (true);

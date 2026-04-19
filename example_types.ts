enum Days {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

interface BaseDomain {
  id: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

interface Institute extends BaseDomain {
  name: string;
  address: string;
  owner_id: string;
}

interface Student extends BaseDomain {
  name: string;
  age: number;
  image_url: string;
  grade: string;
}

interface Owner extends BaseDomain {
  name: string;
  mobile: string;
}

interface Teacher extends BaseDomain {
  name: string;
  mobile: string;
  subject_id: string;
}

interface ClassRoom extends BaseDomain {
  name: string;
  institute_id: string;
  location: string;
  capacity: number;
  is_air_conditioned: boolean;
}

interface Subject extends BaseDomain {
  name: string;
  medium: "ENGLISH" | "SINHALA";
}

interface Teacher_Subject {
  teacher_id: string;
  subject_id: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

interface Class extends BaseDomain {
  name: string;
  class_room_id: string;
  institute_id: string;
  teacher_id: string;
  subject_id: string;
  grade: string;
  start_time: number;
  end_time: number;
  frequency: "WEEKLY" | "OTHER";
  day: Days;
  class_fee: number;
}

interface Student_Class {
  student_id: string; //fk
  class_id: string; //fk
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

interface Student_subject {
  student_id: string; //fk
  subject_id: string; //fk
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

interface Student_class_attendances {
  student_id: string;
  class_id: string;
  attendance_date: number;
  is_present: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

interface Student_class_monthly_payments {
  billing_month: string;
  student_id: string;
  grade: string;
  class_id: string;
  institute_id: string;
  amount_due: number;
  payment_amount: number;
  payment_status: "PENDING" | "PAID" | "FAILED";
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

interface Teacher_class_monthly_payments {
  institute_id: string;
  teacher_id: string;
  class_id: string;
  billing_month: string;
  amount_due: number;
  payment_amount: number;
  payment_status: "PENDING" | "PAID" | "FAILED";
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

interface Student_institute_enrollments {
  student_id: string;
  institute_id: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

interface Teacher_institute_assignments {
  teacher_id: string;
  institute_id: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

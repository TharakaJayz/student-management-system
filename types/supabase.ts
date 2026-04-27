export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      owners: {
        Row: {
          id: string
          name: string
          mobile: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          mobile: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          mobile?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      institutes: {
        Row: {
          id: string
          name: string
          address: string
          owner_id: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          owner_id: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          owner_id?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "institutes_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
        ]
      }
      class_rooms: {
        Row: {
          id: string
          name: string
          institute_id: string
          location: string
          capacity: number
          is_air_conditioned: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          institute_id: string
          location: string
          capacity: number
          is_air_conditioned?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          institute_id?: string
          location?: string
          capacity?: number
          is_air_conditioned?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_rooms_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          id: string
          name: string
          class_room_id: string
          institute_id: string
          teacher_id: string
          subject_id: string
          grade: string
          start_time: number
          end_time: number
          frequency: string
          day: string
          class_fee: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          class_room_id: string
          institute_id: string
          teacher_id: string
          subject_id: string
          grade: string
          start_time: number
          end_time: number
          frequency: string
          day: string
          class_fee: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          class_room_id?: string
          institute_id?: string
          teacher_id?: string
          subject_id?: string
          grade?: string
          start_time?: number
          end_time?: number
          frequency?: string
          day?: string
          class_fee?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_class_room_id_fkey"
            columns: ["class_room_id"]
            isOneToOne: false
            referencedRelation: "class_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          id: string
          name: string
          age: number
          image_url: string
          grade: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          age: number
          image_url?: string
          grade: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          age?: number
          image_url?: string
          grade?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      teachers: {
        Row: {
          id: string
          name: string
          mobile: string
          subject_id: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          mobile: string
          subject_id: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          mobile?: string
          subject_id?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teachers_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_institute_assignments: {
        Row: {
          teacher_id: string
          institute_id: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          teacher_id: string
          institute_id: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          teacher_id?: string
          institute_id?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_institute_assignments_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_institute_assignments_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          id: string
          name: string
          medium: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          medium: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          medium?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      student_institute_enrollments: {
        Row: {
          student_id: string
          institute_id: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          student_id: string
          institute_id: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          student_id?: string
          institute_id?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_institute_enrollments_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_institute_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_classes: {
        Row: {
          student_id: string
          class_id: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          student_id: string
          class_id: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          student_id?: string
          class_id?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_classes_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_classes_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      student_class_attendances: {
        Row: {
          student_id: string
          class_id: string
          attendance_date: number
          is_present: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          student_id: string
          class_id: string
          attendance_date: number
          is_present: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          student_id?: string
          class_id?: string
          attendance_date?: number
          is_present?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_class_attendances_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_class_attendances_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_class_monthly_payments: {
        Row: {
          billing_month: string
          student_id: string
          grade: string
          class_id: string
          institute_id: string
          amount_due: number
          payment_amount: number
          payment_status: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          billing_month: string
          student_id: string
          grade: string
          class_id: string
          institute_id: string
          amount_due: number
          payment_amount: number
          payment_status: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          billing_month?: string
          student_id?: string
          grade?: string
          class_id?: string
          institute_id?: string
          amount_due?: number
          payment_amount?: number
          payment_status?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_class_monthly_payments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_class_monthly_payments_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_class_monthly_payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_subjects: {
        Row: {
          student_id: string
          subject_id: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          student_id: string
          subject_id: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          student_id?: string
          subject_id?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_subjects_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_subjects_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

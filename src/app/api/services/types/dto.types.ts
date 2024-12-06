import {
  Address,
  Gender,
  Payment,
  PaymentRequest,
  PaymentRequestEntry,
  PaymentStatus,
  RESIDENTIAL_STATUS,
  StudentStatus,
  User,
} from "@prisma/client";

export type UserDTO = Omit<User, "password">;
export type AddressDTO = Address;

export type StudentDTO = {
  id: number;
  full_name: string;
  student_id: string;
  roll: number;
  user: UserDTO;
  residential_status: RESIDENTIAL_STATUS;
  student_status: StudentStatus;
  cohort: {
    name: string;
    id: number;
  };
  section: {
    name: string;
    id: number;
  };
  grade: {
    name: string;
    id: number;
  };
};

export type StudentListDTO = {
  students: StudentDTO[];
  count: number;
};

export type StudentProfileDTO = {
  father_name: string;
  mother_name: string;
  guardian_phone: string;
  date_of_birth: string;
  address: AddressDTO;
  gender: Gender;
} & StudentDTO;

export type StudentPaymentDTO = Omit<PaymentDetailsDTO, "user"> & {
  student: StudentDTO;
};

export type StudentPaymentListDTO = {
  payments: StudentPaymentDTO[];
  count: number;
};

export type PaymentDTO = {
  id: number;
  amount: number;
  payment_status: PaymentStatus;
  update_at: string;
  created_at: string;
  payment_method: string;
  payment_request_entry_id: number;
  payment_request?: {
    forMonth?: string | null;
    forYear?: string | null;
    title?: string;
    id?: number;
  };
};

export type PaymentDetailsDTO = PaymentDTO & {
  payment_fields: {
    details: string;
    amount: number;
  }[];
  user: Omit<User, "password" | "permission" | "createdAt">;
};

export type PaymentDetailsListDTO = PaymentDetailsDTO[];

export type TeacherDTO = {
  id: number;
  full_name: string;
  user: UserDTO;
  designation: string;
  subject_expertise: string;
};

export type PaymentRequestEntryDTO = Omit<
  PaymentRequestEntry,
  "payment_details"
> & {
  payment_request: PaymentRequest;
  payment_details: {
    details: string;
    amount: number;
  }[];
  payments: Payment[];
  user: {
    id: number;
    phone: string;
    email?: string;
    student?: {
      id: number;
      student_id: string;
      full_name: string;
      roll: string;
      cohort: {
        name: string;
        id: number;
        section: {
          name: string;
          id: number;
          grade: {
            name: string;
            id: number;
          };
        };
      };
    };
  };
};

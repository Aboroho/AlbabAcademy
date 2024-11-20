import {
  Address,
  Gender,
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
  payment_request: {
    forMonth?: string | null;
    forYear?: string | null;
    title: string;
    id: number;
  };
};

export type PaymentDetailsDTO = PaymentDTO & {
  payment_fields: {
    description: string;
    amount: number;
  }[];
  user: Omit<User, "password" | "permission" | "createdAt">;
};

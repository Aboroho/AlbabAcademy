import {
  Address,
  Assessment,
  AssessmentSubject,
  Cohort,
  Grade,
  Payment,
  PaymentRequest,
  PaymentTemplate,
  PaymentTemplateField,
  RESIDENTIAL_STATUS,
  Section,
  Student,
  Teacher,
  User,
} from "@prisma/client";

// general
export type IAddressResponse = Address;
export type IUserResponse = Omit<User, "password">;

// student group
export type ICohortResponse = Cohort;
export type ISectionResponse = Section;
export type IGradeResponse = Grade;

export interface ISectionResponseWithParent extends Section {
  grade: IGradeResponse;
}
export interface ICohortResponseWithParent extends Cohort {
  section: ISectionResponseWithParent;
}

// student
export interface IStudentResponse extends Student {
  residential_status: RESIDENTIAL_STATUS;
  address: IAddressResponse;
  user: IUserResponse;
  cohort: ICohortResponse;
  section: ISectionResponse;
  grade: IGradeResponse;
}

export interface IStudentResponseWithPaymentInfo extends IStudentResponse {
  payment?: IPaymentResponse;
}

// teacher
export interface ITeacherResponse extends Teacher {
  address: IAddressResponse;
  user: IUserResponse;
  grades?: IGradeResponse;
}

// assessments
export type IAssessmentSubject = AssessmentSubject;
export interface IAssessmentResponse extends Assessment {
  assessment_subjects: IAssessmentSubject[];
  students: IStudentResponse;
}

// payments
export type IPaymentResponse = Payment;
export interface IPaymentResponseDeep extends Payment {
  students?: Student[];
  teachers?: Teacher[];
}
export type IPaymentTemplateFieldResponse = PaymentTemplateField;
export interface IPaymentTemplateResponse extends PaymentTemplate {
  template_fields: IPaymentTemplateFieldResponse[];
}
export interface IPaymentRequestResponse extends PaymentRequest {
  payment_template: IPaymentTemplateResponse;
  payments?: IPaymentResponseDeep[];
}

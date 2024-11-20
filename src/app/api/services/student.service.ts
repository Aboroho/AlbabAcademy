import { PaymentStatus, Prisma, Role } from "@prisma/client";
import { prismaQ } from "../utils/prisma";
import {
  StudentDTO,
  StudentProfileDTO,
  StudentPaymentDTO,
  StudentPaymentListDTO,
  StudentListDTO,
} from "./types/dto.types";
import { APIError } from "../utils/handleError";
import { studentBaseSchema } from "@/components/forms/student-details-form/schema";
import {
  userCreateValidationSchema,
  userUpdateValidationSchema,
} from "../validationSchema/userSchema";
import _ from "lodash";
import { z } from "zod";

/**
 * Raw data retrieved directly from the database
 */
export type StudentDefaultData = Prisma.StudentGetPayload<
  typeof studentDefaultSelectOptions
>;

/**
 * Raw data retrieved directly from the database
 */
export type StudentProfileData = Prisma.StudentGetPayload<
  typeof studentProfileSelectOptions
>;

export interface IStudentService {
  findAll(studentQueryFilter: object): Promise<StudentListDTO>;
  findAllWithPayment(
    studentQueryFilter: object
  ): Promise<StudentPaymentListDTO>;
  findById(id: number): Promise<StudentProfileDTO | undefined>;
  delete(id: number): Promise<boolean>;
  create(student: unknown): Promise<
    | {
        student: StudentDTO;
        payment?: { id: number; payment_status: PaymentStatus };
      }
    | undefined
  >;
  update(id: number, student: unknown): Promise<StudentProfileDTO | undefined>;

  /**
   * @return prisma select options to retrieve default student data
   */
  getStudentDefaultSelectOptions: () => typeof studentDefaultSelectOptions.select;

  /**
   * @return prisma select options to retrive student profile data
   */
  getStudentProfileSelectOptoins: () => typeof studentProfileSelectOptions.select;

  /**
   * Transform raw data to DTO
   */
  studentDefaultDataToDTO: (student: StudentDefaultData) => StudentDTO;

  /**
   * Transform raw data to DTO
   */
  studentProfileDataToProfileDTO: (
    student: StudentProfileData
  ) => StudentProfileDTO;

  getStudentCreateSchema: () => unknown;
}

const studentValidator = Prisma.validator<Prisma.StudentDefaultArgs>();

const studentDefaultSelectOptions = studentValidator({
  select: {
    id: true,
    full_name: true,
    student_id: true,
    roll: true,
    user: true,

    residential_status: true,
    student_status: true,

    cohort: {
      select: {
        name: true,
        id: true,
        section: {
          select: {
            name: true,
            id: true,
            grade: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
      },
    },
  },
});

const studentProfileSelectOptions = studentValidator({
  select: {
    ...studentDefaultSelectOptions.select,
    address: true,
    residential_status: true,
    father_name: true,
    mother_name: true,
    date_of_birth: true,
    guardian_phone: true,
    student_status: true,
    gender: true,
  },
});

const zNumber = z.preprocess(
  (v) => (v ? parseInt(v as string) : v),
  z.number()
);
const studentQueryFilterSchema = z
  .object({
    page: zNumber,
    page_size: zNumber,
    grade_id: zNumber,
    section_id: zNumber,
    cohortId: zNumber,
  })
  .partial();
export type StudentQueryFilter = z.infer<typeof studentQueryFilterSchema>;

export class StudentService implements IStudentService {
  private readonly studentDefaultSelectOptions =
    studentDefaultSelectOptions.select;
  private readonly studentProfileSelectOptions =
    studentProfileSelectOptions.select;

  getStudentDefaultSelectOptions() {
    return this.studentDefaultSelectOptions;
  }
  getStudentProfileSelectOptoins() {
    return this.studentProfileSelectOptions;
  }

  getStudentPrismaFilter(studentQueryFilter?: object) {
    const DEFAULT_PAGE = 1;
    const DEFAULT_PAGE_SIZE = 50;
    const { data } = studentQueryFilterSchema.safeParse(studentQueryFilter);

    const where: Prisma.StudentWhereInput = {
      cohort: {
        id: data?.cohortId,
        section: {
          id: data?.section_id,
          grade: {
            id: data?.grade_id,
          },
        },
      },
    };

    const page = data?.page || DEFAULT_PAGE;
    const pageSize = data?.page_size || DEFAULT_PAGE_SIZE;
    return {
      where,
      take: pageSize,
      skip: (page - 1) * pageSize,
    };
  }
  studentDefaultDataToDTO(student: StudentDefaultData): StudentDTO {
    return {
      id: student.id,
      full_name: student.full_name,
      roll: student.roll,
      residential_status: student.residential_status,
      student_id: student.student_id,
      student_status: student.student_status,
      cohort: {
        name: student.cohort.name,
        id: student.cohort.id,
      },
      section: {
        name: student.cohort.section.name,
        id: student.cohort.section.id,
      },
      grade: {
        name: student.cohort.section.grade.name,
        id: student.cohort.section.grade.id,
      },
      user: student.user,
    };
  }

  studentProfileDataToProfileDTO(
    student: StudentProfileData
  ): StudentProfileDTO {
    const defaultDTO: StudentDTO = this.studentDefaultDataToDTO(student);
    return {
      ...defaultDTO,
      address: student.address,
      date_of_birth: student.date_of_birth.toString(),
      father_name: student.father_name,
      mother_name: student.mother_name,
      guardian_phone: student.guardian_phone,
      gender: student.gender,
    };
  }

  async getStudentByStudentId(studentId: string, excludeId?: number) {
    return await prismaQ.student.findUnique({
      where: {
        student_id: studentId,
        NOT: {
          id: excludeId,
        },
      },
    });
  }

  async getStudentByRollCohort(
    roll: number,
    cohort_id: number,
    excludeId?: number
  ) {
    return await prismaQ.student.findFirst({
      where: {
        roll: roll,
        cohort_id: cohort_id,
        NOT: {
          id: excludeId,
        },
      },
    });
  }

  getStudentCreateSchema() {
    return studentBaseSchema
      .omit({ grade_id: true, section_id: true })
      .extend({
        user: userCreateValidationSchema,
      })
      .superRefine(async (student, ctx) => {
        if (await this.getStudentByStudentId(student.student_id))
          return ctx.addIssue({
            code: "custom",
            message: "Student id should be unique",
            path: ["student_id"],
          });

        if (await this.getStudentByRollCohort(student.roll, student.cohort_id))
          return ctx.addIssue({
            message: "Roll exists on this cohort",
            path: ["roll"],
            code: "custom",
          });
      });
  }
  getStudentUpdateSchema(id: number) {
    return studentBaseSchema
      .omit({ grade_id: true, section_id: true })
      .extend({
        user: userUpdateValidationSchema,
      })
      .superRefine(async (student, ctx) => {
        if (await this.getStudentByStudentId(student.student_id, id))
          return ctx.addIssue({
            code: "custom",
            message: "Student id should be unique",
            path: ["student_id"],
          });

        if (
          await this.getStudentByRollCohort(student.roll, student.cohort_id, id)
        )
          return ctx.addIssue({
            message: "Roll exists on this cohort",
            path: ["roll"],
            code: "custom",
          });
      });
  }

  async findAll(studentQueryFilter?: object) {
    const studentPrismaFilter = this.getStudentPrismaFilter(studentQueryFilter);

    const [students, count] = await prismaQ.$transaction([
      prismaQ.student.findMany({
        select: this.studentDefaultSelectOptions,
        ...studentPrismaFilter,
      }),
      prismaQ.student.count({ where: studentPrismaFilter.where }),
    ]);

    const dto: StudentDTO[] = students.map((student) =>
      this.studentDefaultDataToDTO(student)
    );
    return {
      students: dto,
      count,
    };
  }

  async findAllWithPayment(studentQueryFilter?: object) {
    const {
      where: studentWhereInput,
      take,
      skip,
    } = this.getStudentPrismaFilter(studentQueryFilter);

    console.log(JSON.stringify(studentWhereInput));
    const paymentWhereInput: Prisma.PaymentWhereInput = {
      user: {
        student: studentWhereInput,
      },
      payment_request: {
        payment_target_type: {
          in: ["STUDENT", "COHORT", "SECTION", "GRADE"],
        },
      },
    };

    const paymentSelectInput = {
      createdAt: true,
      updatedAt: true,
      id: true,
      status: true,
      paymentMethod: true,

      user: {
        select: {
          student: {
            select: this.studentDefaultSelectOptions,
          },
        },
      },
      payment_request: {
        select: {
          id: true,
          title: true,
          forMonth: true,
          forYear: true,
          payment_template: {
            select: {
              template_fields: {
                select: {
                  amount: true,
                  description: true,
                },
              },
            },
          },
        },
      },
    };

    const [payments, count] = await prismaQ.$transaction([
      prismaQ.payment.findMany({
        select: paymentSelectInput,
        where: paymentWhereInput,
        take,
        skip,
        orderBy: { createdAt: "desc" },
      }),
      prismaQ.payment.count({ where: paymentWhereInput }),
    ]);

    const studentsWithPayments: StudentPaymentDTO[] = payments.map(
      (payment) => {
        if (!payment.user.student) throw new APIError("Something went wrong");
        return {
          id: payment.id,
          created_at: payment.createdAt.toString(),
          update_at: payment.updatedAt.toString(),
          payment_method: payment.paymentMethod,
          payment_status: payment.status,
          amount:
            payment.payment_request.payment_template.template_fields.reduce(
              (acc, field) => acc + field.amount,
              0
            ),

          student: this.studentDefaultDataToDTO(payment.user.student),
          payment_fields:
            payment.payment_request.payment_template.template_fields,
          payment_request: {
            id: payment.payment_request.id,
            title: payment.payment_request.title,
            forMonth: payment.payment_request.forMonth,
            forYear: payment.payment_request.forYear,
          },
        };
      }
    );

    return { payments: studentsWithPayments, count };
  }

  async findById(id: number) {
    const student = await prismaQ.student.findUnique({
      where: {
        id: id,
      },
      select: this.studentProfileSelectOptions,
    });

    if (!student) throw new APIError("No student found", 404);
    return this.studentProfileDataToProfileDTO(student);
  }

  async delete(id: number): Promise<boolean> {
    const res = await prismaQ.student.delete({
      where: {
        id: id,
      },
    });

    if (res.id) return true;
    return false;
  }

  async getProfile(id: number): Promise<StudentProfileDTO> {
    const studentProfile = await prismaQ.student.findUnique({
      where: {
        id,
      },
      select: this.studentProfileSelectOptions,
    });

    if (!studentProfile) throw new APIError("No student found", 404);
    return this.studentProfileDataToProfileDTO(studentProfile);
  }

  async create(studentData: any) {
    const createSchema = this.getStudentCreateSchema();

    const { student, payment } = await prismaQ.$transaction(async (prismaQ) => {
      const parsedStudent = await createSchema.parseAsync(studentData);
      const parsedUser = parsedStudent.user;

      /**
       * TODO : handle avatar upload
       */
      // if (parsedUser.avatar) {
      //   parsedUser.avatar = await validateFileAndMove(parsedUser.avatar, {
      //     type: ["image/jpeg", "image/png"],
      //   });
      // }

      const refinedUser = {
        ...parsedUser,
        role: "STUDENT" as Role,
      };
      const user = await prismaQ.user.create({
        data: refinedUser,
      });

      const parsedAddress = parsedStudent.address;
      const address = await prismaQ.address.create({
        data: parsedAddress,
      });

      studentData.user_id = user.id;
      studentData.address_id = address.id;

      const refinedStudent = {
        ..._.omit(parsedStudent, [
          "user",
          "address",
          "payment_template_id",
          "payment_status",
        ]),
        user_id: user.id,
        address_id: address.id,
      };

      const student = await prismaQ.student.create({
        data: refinedStudent,
        select: this.studentProfileSelectOptions,
      });

      // initial payment
      console.log(
        parsedStudent.payment_template_id,
        parsedStudent.payment_status
      );
      if (parsedStudent.payment_template_id && parsedStudent.payment_status) {
        const paymentRequest = await prismaQ.paymentRequest.create({
          select: {
            id: true,
          },
          data: {
            payment_target_type: "STUDENT",
            title:
              "Initial Payment for #" +
              student.student_id +
              " - " +
              student.full_name,
            payment_template_id: parsedStudent.payment_template_id,
          },
        });
        const payment = await prismaQ.payment.create({
          select: {
            id: true,
            status: true,
          },
          data: {
            payment_request_id: paymentRequest.id,
            user_id: user.id,
            status: parsedStudent.payment_status,
          },
        });
        return {
          student,
          payment: { id: payment.id, payment_status: payment.status },
        };
      }

      return { student };
    });

    return {
      student: this.studentProfileDataToProfileDTO(student),
      payment: payment,
    };
  }

  async update(id: number, studentData: any) {
    const studentId = id;

    const studentInfo = await prismaQ.student.findUnique({
      where: {
        id: studentId,
      },
    });
    if (!studentInfo || !studentId) throw new APIError("No student found", 404);

    // this step is for validation
    if (studentData.user) studentData.user.id = studentInfo.user_id;
    studentData.id = studentId;

    const studentUpdateSchema = this.getStudentUpdateSchema(id);

    const student = await prismaQ.$transaction(async (prismaQ) => {
      const parsedStudent = await studentUpdateSchema.parseAsync(studentData);

      /**
       * TODO: update avatar
       */
      //   const parsedUser = parsedStudent.user;
      //   if (parsedUser.avatar) {
      //     parsedUser.avatar = await validateFileAndMove(parsedUser.avatar, {
      //       type: ["image/jpeg", "image/png"],
      //     });
      //   }
      //   console.log(parsedUser.avatar);

      return await prismaQ.student.update({
        where: {
          id: studentId,
        },
        data: {
          ..._.omit(parsedStudent, ["cohort_id"]),
          cohort: {
            connect: { id: parsedStudent.cohort_id },
          },
          user: {
            update: parsedStudent.user,
          },
          address: {
            update: parsedStudent.address,
          },
        },
        select: this.studentProfileSelectOptions,
      });
    });

    if (!student) throw new APIError("No student found", 404);
    return this.studentProfileDataToProfileDTO(student);
  }
}

import { Prisma } from "@prisma/client";
import { PaymentDetailsDTO, PaymentDetailsListDTO } from "./types/dto.types";
import { prismaQ } from "../utils/prisma";
import { APIError } from "../utils/handleError";
import { User } from "next-auth";

export type PaymentDetailsDefaultData = Prisma.PaymentGetPayload<
  typeof paymentDetailsDefaultSelectOptions
>;

const paymentValidator = Prisma.validator<Prisma.PaymentDefaultArgs>();
const paymentDetailsDefaultSelectOptions = paymentValidator({
  select: {
    id: true,
    createdAt: true,
    updatedAt: true,
    amount: true,
    payment_request_entry_id: true,
    payment_request_entry: {
      select: {
        id: true,
        payment_details: true,
        payment_request: true,
      },
    },
    paymentMethod: true,
    status: true,
    user: {
      select: {
        username: true,
        id: true,
        email: true,
        role: true,
        avatar: true,
        phone: true,
      },
    },
  },
});

interface IPaymentService {
  findAll(paymentQueryFilter: object): Promise<PaymentDetailsListDTO>;
  findById(id: number): Promise<PaymentDetailsDTO>;
  create(paymentData: unknown): Promise<PaymentDetailsDTO>;
  update(id: number, data: unknown): Promise<PaymentDetailsDTO>;
  delete(id: number): Promise<boolean>;
}

export default class PaymentService implements IPaymentService {
  constructor(private readonly user: User) {}
  private readonly paymentDetailsDefaultSelectOptions =
    paymentDetailsDefaultSelectOptions.select;

  paymentDetailsDefaultDataToDTO(
    payment: PaymentDetailsDefaultData
  ): PaymentDetailsDTO {
    return {
      created_at: payment.createdAt.toString(),
      id: payment.id,
      payment_fields: payment.payment_request_entry?.payment_details as {
        details: string;
        amount: number;
      }[],
      payment_method: payment.paymentMethod,
      payment_request: payment.payment_request_entry?.payment_request,
      payment_status: payment.status,
      user: payment.user,
      update_at: payment.updatedAt.toString(),
      amount: payment.amount,
      payment_request_entry_id: payment.payment_request_entry_id as number,
    };
  }
  getPaymentPrismaFilter(): Prisma.PaymentWhereInput {
    const paymentWhereInput: any = {
      user: {},
    };

    if (["ADMIN", "SUPER_ADMIN", "DIRECTOR"].includes(this.user.role)) {
      paymentWhereInput.user.id = this.user.id;
    }
    return paymentWhereInput;
  }
  async findAll(): Promise<PaymentDetailsListDTO> {
    const paymentWhereInput = this.getPaymentPrismaFilter();

    const payments = await prismaQ.payment.findMany({
      select: this.paymentDetailsDefaultSelectOptions,
      where: paymentWhereInput,
    });

    const paymentListDTO = payments.map((payment) =>
      this.paymentDetailsDefaultDataToDTO(payment)
    );

    return paymentListDTO;
  }

  async findById(id: number): Promise<PaymentDetailsDTO> {
    const payment = await prismaQ.payment.findUnique({
      select: this.paymentDetailsDefaultSelectOptions,
      where: {
        id,
      },
    });

    if (!payment) throw new APIError("No payment found", 404);
    return this.paymentDetailsDefaultDataToDTO(payment);
  }
  create(): Promise<PaymentDetailsDTO> {
    throw new APIError("not implemented");
  }

  async delete(id: number): Promise<boolean> {
    const payment = await prismaQ.payment.delete({
      where: {
        id,
      },
    });
    if (!payment) throw new APIError("No payment found");

    return true;
  }
  update(): Promise<PaymentDetailsDTO> {
    throw new APIError("not implemented");
  }
}

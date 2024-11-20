// import { Prisma } from "@prisma/client";

// const paymentValidator = Prisma.validator<Prisma.PaymentDefaultArgs>();

// const studentDefaultSelectOptions = paymentValidator({
//   select: {
//     id: true,
//     createdAt: true,
//     updatedAt: true,
//     payment_request: {
//       select: {
//         forMonth: true,
//         forYear: true,
//         title: true,
//         id: true,
//       },
//     },
//     paymentMethod: true,
//     status: true,
//     user: {
//       select: {
//         id: true,
//         email: true,
//         role: true,
//         avatar: true,
//         phone: true,
//       },
//     },
//   },
// });

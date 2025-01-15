import {
  NoticeCategory,
  NoticeTarget,
  NoticeType,
  PrismaClient,
} from "@prisma/client";
import { NoticeDTO, NoticeListDTO } from "./types/dto.types";

export interface INoticeService {
  findAllWithFilter(noticeQueryFilter: object): Promise<NoticeListDTO>;
  // findById(id: number): Promise<NoticeDTO | undefined | null>;
  // delete(id: number): Promise<boolean>;
  // create(notice: unknown): Promise<NoticeDTO | undefined>;
  // update(id: number, notice: unknown): Promise<NoticeDTO | undefined>;
}

export class NoticeService implements INoticeService {
  constructor(private readonly prisma: PrismaClient) {}

  async findAllWithFilter(noticeQueryFilter: {
    target: NoticeTarget;
    type: NoticeType;
    category: NoticeCategory;
    status?: "ACTIVE" | "INACTIVE" | "ARCHIVED";
    page?: number;
    pageSize?: number;
  }): Promise<NoticeListDTO> {
    const target = noticeQueryFilter.target;
    const type = noticeQueryFilter.type;
    const category = noticeQueryFilter.category;
    const status = noticeQueryFilter.status || "ACTIVE";
    const page = noticeQueryFilter.page || 1;
    const pageSize = noticeQueryFilter.pageSize || 50;

    const [notices, count] = await this.prisma.$transaction([
      this.prisma.notice.findMany({
        where: {
          notice_target: target,
          notice_type: type,
          notice_category: category,
          status,
        },

        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          created_at: "desc",
        },
      }),
      this.prisma.notice.count({
        where: {
          notice_category: category,
          notice_type: "PUBLIC",
        },
      }),
    ]);

    return {
      notices,
      count,
    };
  }

  async findById(id: number): Promise<NoticeDTO | undefined | null> {
    return await this.prisma.notice.findUnique({
      where: { id },
    });
  }
  async delete(id: number): Promise<boolean> {
    await this.prisma.notice.delete({
      where: { id },
    });
    return true;
  }
  // async create(notice: unknown): Promise<NoticeDTO | undefined> {
  //   return await this.prisma.notice.create({
  //     data: notice,
  //   });
  // }
  // async update(id: number, notice: unknown): Promise<NoticeDTO | undefined> {
  //   return await this.prisma.notice.update({
  //     where: { id },
  //     data: notice,
  //   });
  // }
}

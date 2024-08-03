import { Course, Prisma, PrismaClient, Section } from "@prisma/client";
import prisma from '../config/database';
import { MulterUtil } from "../config/multer_config";

class CourseService {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async createCourse(params: Omit<Course & {file: Express.Multer.File}, 'id'>): Promise<Course> {
    const previewUrl = await MulterUtil.updateMedia(null, params.file!.filename);
    params.previewUrl = previewUrl;
    console.log(params.ownerId)
    return await this.prisma.course.create({
      data: {
        owner: {
          connect: {
            id: Number(params.ownerId)
          }
        },
        title: params.title,
        description: params.description,
        previewUrl: params.previewUrl,
        price: params.price ? Number(params.price) : 0
      },
      include: {
        sections: true
      }
    });
  }

  async getCourseById(id: number): Promise<Course | null> {
    return await this.prisma.course.findUnique({
      where: { id },
      include: {
        sections: true
      },
    });
  }

  async getAll(
    params: Partial<Omit<Course, "ownerId">> & Partial<{ take: string; skip: string; ownerId: string; allData: string }>
  ): Promise<Course[]> {
    return await this.prisma.course.findMany({
      where: {
        ...(params.ownerId && { ownerId: Number(params.ownerId) }), // Фильтр по ownerId, если он передан
        ...(params.title && { title: params.title }), // Фильтр по title, если он передан
      },
      skip: params.skip ? Number(params.skip) : undefined, // Пропускаем, если параметр skip не передан
      take: params.take ? Number(params.take) : undefined, // Берем все, если параметр take не передан
      include: {
        sections: params.allData === "true" // Включаем секции, если allData равен "true"
      },
    });
  }

  async updateCourse(id: number, params: Partial<Course & {file: Express.Multer.File} & {sections: Section[]}>): Promise<Course> {

    const oldCourse = (await this.getCourseById(id));
    if (!oldCourse) {
      throw Error("Course not founded")
    }
    let previewUrl: string | null = oldCourse.previewUrl;
    if (params.file) {
      previewUrl = await MulterUtil.updateMedia(oldCourse.previewUrl, params.file.filename);
    }

    return await this.prisma.course.update({
      where: { id },
      data: {
        title: params.title ?? oldCourse.title,
        description: params.description ?? oldCourse.description,
        price: params.price ?? oldCourse.price,
        enabled: params.enabled ?? oldCourse.enabled,
        previewUrl: previewUrl ?? oldCourse.previewUrl
      }
    });
  }

  async deleteCourse(id: number): Promise<Course> {
    return await this.prisma.course.delete({
      where: { id },
    });
  }

}

export const courseService = new CourseService(prisma);
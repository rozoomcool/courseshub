import { Course, Prisma, PrismaClient } from "@prisma/client";
import prisma from '../config/database';

class CourseService {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async createCourse(data: Omit<Course, 'id'>): Promise<Course> {
    return await this.prisma.course.create({
      data,
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

  async getAll(params: Partial<Omit<Course, "ownerId">> & Partial<{ take: string, skip: string, ownerId: string, allData: string }>): Promise<Course[]> {
    return await this.prisma.course.findMany({
      where: {
        ownerId: Number(params.ownerId),
        title: params.title
      },
      skip: Number(params.skip),
      take: Number(params.take),
      include: {
        sections: Boolean(params.allData)
      },
    });
  }

  async updateCourse(id: number, data: Partial<Course>): Promise<Course> {
    return await this.prisma.course.update({
      where: { id },
      data,
    });
  }

  async deleteCourse(id: number): Promise<Course> {
    return await this.prisma.course.delete({
      where: { id },
    });
  }

}

export const courseService = new CourseService(prisma);
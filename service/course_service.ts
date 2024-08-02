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
        //   include: { sections: true },
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
import { PrismaClient, Lesson } from '@prisma/client';

const prisma = new PrismaClient();

class LessonService {
    private prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient;
    }

    async createLesson(data: Omit<Lesson, 'id'>): Promise<Lesson> {
        return await this.prisma.lesson.create({
            data,
        });
    }

    async getLessonById(id: number): Promise<Lesson | null> {
        return await this.prisma.lesson.findUnique({
            where: { id },
            include: { stages: true, lessonMedias: true },
        });
    }

    async updateLesson(id: number, data: Partial<Lesson>): Promise<Lesson> {
        return await this.prisma.lesson.update({
            where: { id },
            data,
        });
    }

    async deleteLesson(id: number): Promise<Lesson> {
        return await this.prisma.lesson.delete({
            where: { id },
        });
    }
}

export const lessonService = new LessonService(prisma);
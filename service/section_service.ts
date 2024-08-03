import { PrismaClient, Section } from '@prisma/client';

const prisma = new PrismaClient();

class SectionService {
    private prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient;
    }

    async createSection(userId: number, params: Omit<Section, 'id'>): Promise<Section> {
        const course = await this.prisma.course.findUnique({where: {id: params.courseId, ownerId: userId}});
        const isCan = course && course!.ownerId == userId;
        if (isCan) {
            return await this.prisma.section.create({
                data: {
                    title: params.title,
                    course: {
                        connect: {id: course.id}
                    }
                },
            });
        } else {
            throw Error("Permission denied");
        }
    }

    async getSectionById(id: number): Promise<Section | null> {
        return await this.prisma.section.findUnique({
            where: { id },
            include: { lessons: true },
        });
    }

    async updateSection(id: number, data: Partial<Section>): Promise<Section> {
        return await this.prisma.section.update({
            where: { id },
            data,
        });
    }

    async deleteSection(id: number): Promise<Section> {
        return await this.prisma.section.delete({
            where: { id },
        });
    }
}

export const sectionService = new SectionService(prisma);

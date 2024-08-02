import { PrismaClient, Section } from '@prisma/client';

const prisma = new PrismaClient();

class SectionService {
    private prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient;
    }

    async createSection(data: Omit<Section, 'id'>): Promise<Section> {
        return await this.prisma.section.create({
            data,
        });
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

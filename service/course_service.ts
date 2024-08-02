import { Prisma, PrismaClient } from "@prisma/client";
import prisma from '../config/database';

class CourseService {
    private prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient;
    }

}

export const courseService = new CourseService(prisma);
import { LessonMedia, PrismaClient } from "@prisma/client";
import prisma from "../config/database";

class LessonMediaService {
    private prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient;
    }
    
    async addMediaToLesson(lessonId: number, mediaUrls: string[]): Promise<void> {
      const lessonMedias = mediaUrls.map(url => ({ url, lessonId }));
      await this.prisma.lessonMedia.createMany({
        data: lessonMedias,
      });
    }
  
    async getMediaByLessonId(lessonId: number): Promise<LessonMedia[]> {
      return await this.prisma.lessonMedia.findMany({
        where: { lessonId },
      });
    }
  
    async deleteMedia(id: number): Promise<LessonMedia> {
      return await this.prisma.lessonMedia.delete({
        where: { id },
      });
    }
  }

export const lessonMediaService = new LessonMediaService(prisma);
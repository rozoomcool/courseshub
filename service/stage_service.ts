import { PrismaClient, Stage, StageType } from "@prisma/client";
import prisma from "../config/database";

class StageService {
    private prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient;
    }

    async createStage(data: { type: StageType; lessonId: number }): Promise<Stage> {
        return await this.prisma.stage.create({
          data,
        });
      }
    
      async getStageById(id: number): Promise<Stage | null> {
        return await this.prisma.stage.findUnique({
          where: { id },
        });
      }
    
      async updateStage(id: number, data: Partial<Stage>): Promise<Stage> {
        return await this.prisma.stage.update({
          where: { id },
          data,
        });
      }
    
      async deleteStage(id: number): Promise<Stage> {
        return await this.prisma.stage.delete({
          where: { id },
        });
      }

}

export const stageService = new StageService(prisma);
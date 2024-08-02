import { Project, ProjectStatus } from "@prisma/client";
import { PrismaClient } from "@prisma/client/extension";
import prisma from "../config/database";

interface ProjectCreateParams {
    name: string;
    description: string;
    readme: string;
    ownerId: number;
    status: ProjectStatus
}

class ProjectService {
    private prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient;
    }

    async getProjectById(projectId: number): Promise<Project> {
        return await this.prisma.project.findUnique({
            where: { id: projectId },
            include: {
                members: true
            }
        });
    }

    async getAllProjects(fast: boolean = false) {
        return await this.prisma.project.findMany(
            {
                include: {
                    members: fast
                }
            }
        );
    }

    async createProject(params: ProjectCreateParams) {
        return await this.prisma.project.create({
            data: params,
            include: {
                members: true
            }
        });
    }

    async deleteProject(projectId: number) {
        return await this.prisma.project.delete({
            where: {
                id: projectId
            }
        });
    }
}

export const projectService = new ProjectService(prisma);
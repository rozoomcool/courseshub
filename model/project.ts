import { ProjectStatus } from "@prisma/client";

export interface ProjectCreateRequest {
    name: string;
    description: string;
    readme: string;
    status: ProjectStatus;
}
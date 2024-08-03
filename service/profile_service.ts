import { PrismaClient, Profile, User } from "@prisma/client";
import prisma from "../config/database";

export interface ProfileUpdateParams {
    firstname: string | null;
    lastname: string | null;
    surname: string | null;
    professtion: string | null;
    telegram: string | null;
    userId: number;
}

class ProfileService {
    private prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient
    }

    async saveProfile(params: Partial<Omit<Profile, "id">>) {
        return await this.prisma.profile.create({
            data: {
                userId: params.userId!,
                firstname: params.firstname,
                lastname: params.lastname,
                surname: params.surname
            }
        })
    }

    async updateProfile(params: Partial<Omit<Profile, "id">>) {
        return await this.prisma.profile.update({
            where: {
                userId: params.userId
            },
            data: params
        })
    }

    async getProfileByUserId(userId: number): Promise<Profile | null> {
        return await this.prisma.profile.findUnique({
            where: {
                userId
            },
            include: {
                user: true
            }
        })
    }
}

export const profileService = new ProfileService(prisma);
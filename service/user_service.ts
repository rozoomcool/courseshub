import prisma from '../config/database';
import bcrypt from 'bcryptjs';
import { UserModel } from '../model/user';
import { PrismaClient, User } from '@prisma/client';
import dotenv from 'dotenv';
import { MulterUtil } from '../config/multer_config';
import path from 'path';
import {SERVER_URL, UPLOADS_DIR} from '../config/config';

interface UpdateUserParams {
    id: number;
    username?: string;
    // password?: string;
    avatarUrl: string;
  }

  interface UpdateUserAvatarParams {
    id: number;
    fileName: string;
  }


class UserService {

    private prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient;
    }

    async createUser(user: Omit<User, 'id'>) {
        const {username, password, role} = user
        const hashed = bcrypt.hashSync(password, 10);
        return await this.prisma.user.create({
            data: {
                username,
                password: hashed,
                role
            }
        });
    }

    async deleteUser(id: number) {
        return await this.prisma.user.delete({
            where: {
                id
            }
        });
    }

    async loginUser(requestUser: UserModel): Promise<UserModel | null> {
        const user = await this.getUserByUsername(requestUser.username);
        if (bcrypt.compareSync(requestUser.password, user!.password)) {
            return user as UserModel;
        }
        return null;
    }
    
    async getUserById (id: number) {
        return await this.prisma.user.findUnique({
            where: { id },
        });
    }

    async getUserByUsername(username: string) {
        return await this.prisma.user.findUnique({
            where: {username}
        })
    }
    
    async getUsers() {
        return await this.prisma.user.findMany();
    }
    
    async updateUser(params: UpdateUserParams): Promise<User> {
        const user: User | null = await this.prisma.user.findUnique({ where: { id: params.id } });
        if (user == null) {
            throw Error("User not found exception");
        }

        let newAvatar: string | null = user.avatarUrl;
        
        if (params.avatarUrl != user.avatarUrl) {
            if (user.avatarUrl != null) {
                console.log("....");
                MulterUtil.deleteImage(user.avatarUrl!);
            }
            newAvatar = path.join(SERVER_URL, UPLOADS_DIR, params.avatarUrl);
        }
        console.log(`::: ${newAvatar}`)

        const entity = await this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                avatarUrl: newAvatar
            }
        })
        
        return entity;
    }
}

export const userService = new UserService(prisma);
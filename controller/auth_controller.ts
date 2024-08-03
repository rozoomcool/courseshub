import { Router } from 'express';
import { UserModel } from '../model/user';
import { userService } from '../service/user_service';
import { AuthPayloadContext, JwtService } from '../service/jwt_service';
import { omit } from '../utils/utils';
import { profileService } from '../service/profile_service';
import { Profile, User } from '@prisma/client';

export const authRouter = Router()

authRouter.post('/register', async (req, res) => {
    try {
        const user = req.body as Omit<User, "id"> & Partial<Profile>;
        const created = await userService.createUser(user);
        user.userId = created.id
        const profile = await profileService.saveProfile(user)
        return res.status(201).json(created);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(400).json({ error: 'An unexpected error occurred' });
        }
    }
});

authRouter.post('/login', async (req, res) => {
    try {
        const currentUser = await userService.loginUser(req.body as UserModel)
        if(currentUser == null) {
            return res.status(400);
        }
        const access = await JwtService.generateAccessToke(omit(currentUser, ["password"]) as AuthPayloadContext);
        const refresh = await JwtService.generateRefreshToken(currentUser.id as number)
        return res.status(200).json({
            access,
            refresh
        });
    } catch (error) {
        console.log(error)
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(400).json({ error: 'An unexpected error occurred' });
        }
    }
});

authRouter.post('/refresh', async (req, res) => {
    try {
        const userId = await JwtService.verifyRefreshToken(req.body.refresh as string);
        const currentUser = await userService.getUserById(userId.id);

        if(currentUser == null) {
            return res.status(400);
        }
        const access = await JwtService.generateAccessToke(omit(currentUser, ["password"]) as AuthPayloadContext);
        const refresh = await JwtService.generateRefreshToken(currentUser.id as number)
        return res.status(200).json({
            access,
            refresh
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(400).json({ error: 'An unexpected error occurred' });
        }
    }
});
import { Router } from "express";
import { ProfileUpdateParams, profileService } from "../service/profile_service";
import { authMiddleware } from "../middleware/auth_middleware";
import { Profile } from "@prisma/client";

export const profileRoute = Router();

profileRoute.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const data = profileService.getProfileByUserId(id);
        return res.status(201).json(data);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(400).json({ error: 'An unexpected error occurred' });
        }
    }
});

profileRoute.get("/", authMiddleware(), async (req, res) => {
    try {
        const id = req.user.id;
        const data = await profileService.getProfileByUserId(id);
        return res.json(data);
    } catch(error) {
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        } else {
            return res.status(400).json({ error: 'An unexpected error occurred' });
        }
    }
});

profileRoute.put("/", authMiddleware(), async (req, res) => {
    try {
        const id = req.user.id;
        const data = req.body as Partial<Omit<Profile, "id">>;
        data.userId = id;
        const result = await profileService.updateProfile(data);
        return res.json(result);
    } catch(error) {
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        } else {
            return res.status(400).json({ error: 'An unexpected error occurred' });
        }
    }
});
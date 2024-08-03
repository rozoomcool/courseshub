import { Router } from "express";
import { authMiddleware } from "../middleware/auth_middleware";
import { userService } from "../service/user_service";
import upload from "../config/multer_config";

export const userRouter = Router();

userRouter.get('/', authMiddleware(), async (req, res) => {
    const users = await userService.getUsers();
    res.json(users);
});

userRouter.get('/me', authMiddleware(), async (req, res) => {
    try {
        const users = await userService.getUserById(req.user.id);
        res.json(users);
    } catch(e) {
        res.status(400).json("Error get user")
    }
});

userRouter.get('/:id', authMiddleware(), async (req, res) => {
    const { id } = req.params;
    const user = await userService.getUserById(Number(id));
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

userRouter.put('/:id', authMiddleware(), async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const user = await userService.updateUser({
            id: Number(id),
            avatarUrl: data.avatarUrl
        });
        res.json(user);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(400).json({ error: 'An unexpected error occurred' });
        }
    }
});

userRouter.delete('/:id', authMiddleware(), async (req, res) => {
    const { id } = req.params;
    try {
        if (req.user.id == id) {
            await userService.deleteUser(Number(id));
            res.status(204).end();
        } else {
            res.status(401).send("Permission denied");
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(400).json({ error: 'An unexpected error occurred' });
        }
    }
});

userRouter.post("/avatar", upload.single("avatar"), authMiddleware(), async (req, res) => {
    try {
        const entity = await userService.updateUser({id: req.user.id, avatarUrl: req.file!.filename});
        return res.status(200).json(entity);
    } catch (e) {
        console.log(e);
        return res.status(400).json(e);
    }
});
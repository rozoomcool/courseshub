import { Router } from "express";
import {projectService} from "../service/project_service";
import { ProjectCreateRequest } from "../model/project";
import {authMiddleware} from "../middleware/auth_middleware";

export const projectRouter = Router();

projectRouter.get("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const project = await projectService.getProjectById(id);
        res.send(project);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(400).json({ error: 'An unexpected error occurred' });
        }
    }
});

projectRouter.get("/", async (req, res) => {
    try {
        // const fast = Boolean(req.query.fast);
        const projects = await projectService.getAllProjects();
        res.send(projects);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(400).json({ error: 'An unexpected error occurred' });
        }
    }
});

projectRouter.post("/", authMiddleware, async (req, res) => {
    try {
        const projectRequest = req.body as ProjectCreateRequest;
        const project = await projectService.createProject({...projectRequest, ownerId: req.user!.id});
        res.send(project);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(400).json({ error: 'An unexpected error occurred' });
        }
    }
});
import express, { Request, Response } from 'express';
import { Role, StageType } from '@prisma/client';
import { stageService } from '../service/stage_service';
import { authMiddleware } from '../middleware/auth_middleware';

const router = express.Router();

// Create a new stage
router.post('/stages', authMiddleware(Role.TEACHER), async (req: Request, res: Response) => {
  try {
    const { type, lessonId } = req.body;
    const stage = await stageService.createStage({
      type: type as StageType,
      lessonId: parseInt(lessonId),
    });
    res.status(201).json(stage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create stage' });
  }
});

// Get a stage by ID
router.get('/stages/:id', authMiddleware(Role.TEACHER), async (req: Request, res: Response) => {
  try {
    const stageId = parseInt(req.params.id);
    const stage = await stageService.getStageById(stageId);
    if (!stage) {
      return res.status(404).json({ error: 'Stage not found' });
    }
    res.json(stage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get stage' });
  }
});

// Update a stage by ID
router.put('/stages/:id', authMiddleware(Role.TEACHER), async (req: Request, res: Response) => {
  try {
    const stageId = parseInt(req.params.id);
    const stage = await stageService.updateStage(stageId, req.body);
    res.json(stage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update stage' });
  }
});

// Delete a stage by ID
router.delete('/stages/:id', authMiddleware(Role.TEACHER), async (req: Request, res: Response) => {
  try {
    const stageId = parseInt(req.params.id);
    await stageService.deleteStage(stageId);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete stage' });
  }
});

export default router;

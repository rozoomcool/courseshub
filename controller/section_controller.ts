import { Router, Request, Response } from 'express';
import { Role, StageType } from '@prisma/client';
import { sectionService } from '../service/section_service';
import { authMiddleware } from '../middleware/auth_middleware';

export const sectionRouter = Router();

// Create a new section
sectionRouter.post('/', authMiddleware(Role.TEACHER), async (req: Request, res: Response) => {
  try {
    const section = await sectionService.createSection(req.user.id, req.body);
    res.status(201).json(section);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create section' });
  }
});

// Get a section by ID
sectionRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const sectionId = parseInt(req.params.id);
    const section = await sectionService.getSectionById(sectionId);
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }
    res.json(section);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get section' });
  }
});

// Update a section by ID
sectionRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const sectionId = parseInt(req.params.id);
    const section = await sectionService.updateSection(sectionId, req.body);
    res.json(section);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update section' });
  }
});

// Delete a section by ID
sectionRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const sectionId = parseInt(req.params.id);
    await sectionService.deleteSection(sectionId);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete section' });
  }
});

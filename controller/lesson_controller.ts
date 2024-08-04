import express, { Request, Response } from 'express';
import upload from '../config/multer_config';
import { lessonService } from '../service/lesson_service';
import { lessonMediaService } from '../service/lesson_media_service';

const lessonRouter = express.Router();

// Create a new lesson and add media
lessonRouter.post('/lessons', async (req: Request, res: Response) => {
  try {
    const { sectionId, title } = req.body;
    const lesson = await lessonService.createLesson({ sectionId: parseInt(sectionId), title });

    const mediaFiles = (req.files as Express.Multer.File[]).map(file => `/uploads/${file.filename}`);
    await lessonMediaService.addMediaToLesson(lesson.id, mediaFiles);

    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create lesson and upload media' });
  }
});

// Get a lesson by ID
lessonRouter.get('/lessons/:id', async (req: Request, res: Response) => {
  try {
    const lessonId = parseInt(req.params.id);
    const lesson = await lessonService.getLessonById(lessonId);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get lesson' });
  }
});

// Update a lesson by ID
lessonRouter.put('/lessons/:id', async (req: Request, res: Response) => {
  try {
    const lessonId = parseInt(req.params.id);
    const lesson = await lessonService.updateLesson(lessonId, req.body);
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

// Delete a lesson by ID
lessonRouter.delete('/lessons/:id', async (req: Request, res: Response) => {
  try {
    const lessonId = parseInt(req.params.id);
    await lessonService.deleteLesson(lessonId);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
});

export default lessonRouter;

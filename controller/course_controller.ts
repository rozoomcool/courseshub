import express, { Request, Response } from 'express';
import {courseService} from '../service/course_service';
import { authMiddleware } from '../middleware/auth_middleware';
import { Role } from '@prisma/client';

export const courseRouter = express.Router();

// Create a new course
courseRouter.post('/', authMiddleware(Role.TEACHER), async (req: Request, res: Response) => {
  try {
    const ownerId = req.user.id;
    req.body.ownerId = ownerId;
    const course = await courseService.createCourse(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Get a course by ID
courseRouter.get('/:id', authMiddleware(), async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.id);
    const course = await courseService.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get course' });
  }
});

// Get a course by ID
courseRouter.get('/', authMiddleware(), async (req: Request, res: Response) => {
  try {
    const course = await courseService.getAll(req.query);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to get course' });
  }
});

// Update a course by ID
courseRouter.put('/:id', authMiddleware(Role.TEACHER), async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.id);
    const course = await courseService.updateCourse(courseId, req.body);
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// Delete a course by ID
courseRouter.delete('/:id', authMiddleware(Role.TEACHER), async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.id);
    if (courseId == req.user.id) {
      await courseService.deleteCourse(courseId);
      res.status(204).end();
    } else {
      res.status(403).json("Permission denied");
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

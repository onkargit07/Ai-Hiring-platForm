import { Router } from 'express';
import { body } from 'express-validator';
import * as jobController from '../controllers/job.controller';
import { authenticate, authorizeRole } from '../middleware/auth.middleware';

const router = Router();

// Get all active jobs (public or candidate)
router.get('/', jobController.getAllJobs);

// Get job by ID
router.get('/:id', jobController.getJobById);

// Create job post (recruiter only)
router.post(
  '/',
  authenticate,
  authorizeRole('RECRUITER'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('skillsRequired').isArray().withMessage('Skills must be an array'),
    body('experienceLevel').notEmpty().withMessage('Experience level is required'),
    body('location').notEmpty().withMessage('Location is required')
  ],
  jobController.createJob
);

// Update job post (recruiter only)
router.put(
  '/:id',
  authenticate,
  authorizeRole('RECRUITER'),
  jobController.updateJob
);

// Delete job post (recruiter only)
router.delete(
  '/:id',
  authenticate,
  authorizeRole('RECRUITER'),
  jobController.deleteJob
);

// Get recruiter's jobs
router.get(
  '/recruiter/my-jobs',
  authenticate,
  authorizeRole('RECRUITER'),
  jobController.getRecruiterJobs
);

export default router;

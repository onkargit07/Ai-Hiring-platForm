import { Router } from 'express';
import { body } from 'express-validator';
import * as applicationController from '../controllers/application.controller';
import { authenticate, authorizeRole } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Apply to job (candidate only)
router.post(
  '/apply',
  authenticate,
  authorizeRole('CANDIDATE'),
  upload.single('resume'),
  [
    body('jobPostId').notEmpty().withMessage('Job post ID is required'),
    body('skills').notEmpty().withMessage('Skills are required'),
    body('experience').notEmpty().withMessage('Experience is required')
  ],
  applicationController.applyToJob
);

// Get applications for a job (recruiter only)
router.get(
  '/job/:jobId',
  authenticate,
  authorizeRole('RECRUITER'),
  applicationController.getJobApplications
);

// Get candidate's applications
router.get(
  '/my-applications',
  authenticate,
  authorizeRole('CANDIDATE'),
  applicationController.getCandidateApplications
);

// Update application status (recruiter only)
router.patch(
  '/:id/status',
  authenticate,
  authorizeRole('RECRUITER'),
  [
    body('status').isIn(['APPLIED', 'VIEWED', 'SHORTLISTED', 'REJECTED', 'SELECTED'])
      .withMessage('Invalid status')
  ],
  applicationController.updateApplicationStatus
);

export default router;

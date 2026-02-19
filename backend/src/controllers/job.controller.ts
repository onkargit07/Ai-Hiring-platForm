import { Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const createJob = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      skillsRequired,
      experienceLevel,
      location,
      isRemote,
      salaryMin,
      salaryMax,
      education,
      customQuestions,
      requiredFields,
      optionalFields
    } = req.body;

    const jobPost = await prisma.jobPost.create({
      data: {
        title,
        description,
        skillsRequired,
        experienceLevel,
        location,
        isRemote: isRemote || false,
        salaryMin,
        salaryMax,
        education,
        customQuestions,
        requiredFields,
        optionalFields,
        recruiterId: req.user!.id
      },
      include: {
        recruiter: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Job post created successfully',
      jobPost
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ error: 'Failed to create job post' });
  }
};

export const getAllJobs = async (req: AuthRequest, res: Response) => {
  try {
    const { role, location, experienceLevel, skills } = req.query;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { isActive: true };

    if (role) where.title = { contains: role as string, mode: 'insensitive' };
    if (location) where.location = { contains: location as string, mode: 'insensitive' };
    if (experienceLevel) where.experienceLevel = experienceLevel as string;
    if (skills) {
      const skillsArray = (skills as string).split(',');
      where.skillsRequired = { hasSome: skillsArray };
    }

    const jobs = await prisma.jobPost.findMany({
      where,
      include: {
        recruiter: {
          select: {
            id: true,
            fullName: true
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ jobs });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

export const getJobById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const job = await prisma.jobPost.findUnique({
      where: { id },
      include: {
        recruiter: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ job });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
};

export const getRecruiterJobs = async (req: AuthRequest, res: Response) => {
  try {
    const jobs = await prisma.jobPost.findMany({
      where: { recruiterId: req.user!.id },
      include: {
        _count: {
          select: {
            applications: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ jobs });
  } catch (error) {
    console.error('Get recruiter jobs error:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

export const updateJob = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if job belongs to recruiter
    const job = await prisma.jobPost.findUnique({ where: { id } });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    if (job.recruiterId !== req.user!.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedJob = await prisma.jobPost.update({
      where: { id },
      data: req.body
    });

    res.json({
      message: 'Job updated successfully',
      job: updatedJob
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ error: 'Failed to update job' });
  }
};

export const deleteJob = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if job belongs to recruiter
    const job = await prisma.jobPost.findUnique({ where: { id } });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    if (job.recruiterId !== req.user!.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.jobPost.delete({ where: { id } });

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
};

import { Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { scoreCandidateWithGemini, compareApplicationsForRanking } from '../services/gemini-ai.service';

const prisma = new PrismaClient();

export const applyToJob = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Resume is required' });
    }

    const {
      jobPostId,
      skills,
      experience,
      educationLevel,
      portfolio,
      coverLetter,
      customAnswers
    } = req.body;

    // Check if job exists
    const job = await prisma.jobPost.findUnique({ where: { id: jobPostId } });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await prisma.application.findUnique({
      where: {
        candidateId_jobPostId: {
          candidateId: req.user!.id,
          jobPostId
        }
      }
    });

    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied to this job' });
    }

    const resumeUrl = `/uploads/${req.file.filename}`;

    // Score the candidate using Gemini AI with enhanced project complexity analysis
    const aiResult = await scoreCandidateWithGemini(job, {
      skills: typeof skills === 'string' ? JSON.parse(skills) : skills,
      experience,
      educationLevel,
      portfolio,
      coverLetter
    });

    // Create application with enhanced AI scoring
    const application = await prisma.application.create({
      data: {
        candidateId: req.user!.id,
        jobPostId,
        resumeUrl,
        skills: typeof skills === 'string' ? JSON.parse(skills) : skills,
        experience,
        educationLevel,
        portfolio,
        coverLetter,
        customAnswers: customAnswers ? JSON.parse(customAnswers) : null,
        suitabilityScore: aiResult.score,
        projectComplexityScore: aiResult.projectComplexityScore,
        experienceYears: aiResult.experienceYears,
        ...(aiResult.isOverqualified !== undefined && { isOverqualified: aiResult.isOverqualified }),
        ...(aiResult.analysis && { aiAnalysis: aiResult.analysis })
      },
      include: {
        jobPost: {
          select: {
            title: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Apply to job error:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
};

export const getJobApplications = async (req: AuthRequest, res: Response) => {
  try {
    const { jobId } = req.params;

    // Check if job belongs to recruiter
    const job = await prisma.jobPost.findUnique({ where: { id: jobId } });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    if (job.recruiterId !== req.user!.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get applications with multi-level sorting (score → complexity → experience → timestamp)
    const applications = await prisma.application.findMany({
      where: { jobPostId: jobId },
      include: {
        candidate: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });

    // Apply advanced tie-breaking logic
    const sortedApplications = applications.sort(compareApplicationsForRanking);

    // Identify top 10 with rank
    const applicationsWithRank = sortedApplications.map((app, index) => ({
      ...app,
      rank: index + 1,
      isTopCandidate: index < 10
    }));

    res.json({ applications: applicationsWithRank });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

export const getCandidateApplications = async (req: AuthRequest, res: Response) => {
  try {
    const applications = await prisma.application.findMany({
      where: { candidateId: req.user!.id },
      include: {
        jobPost: {
          select: {
            id: true,
            title: true,
            location: true,
            isRemote: true,
            experienceLevel: true,
            recruiter: {
              select: {
                fullName: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ applications });
  } catch (error) {
    console.error('Get candidate applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;

    // Get application with job details
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        jobPost: true
      }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check if job belongs to recruiter
    if (application.jobPost.recruiterId !== req.user!.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update status
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { status }
    });

    res.json({
      message: 'Application status updated successfully',
      application: updatedApplication
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
};

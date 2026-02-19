import { z } from 'zod';

// User validation schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['RECRUITER', 'CANDIDATE']),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Job validation schemas
export const createJobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  department: z.string().min(2, 'Department is required'),
  location: z.string().min(2, 'Location is required'),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']),
  experienceLevel: z.enum(['ENTRY', 'MID', 'SENIOR', 'LEAD']),
  requiredSkills: z.array(z.string()).min(1, 'At least one skill is required'),
  customQuestions: z.array(z.object({
    question: z.string().min(5, 'Question must be at least 5 characters'),
    type: z.enum(['text', 'number', 'boolean', 'select', 'multiselect']),
    required: z.boolean(),
    options: z.array(z.string()).optional(),
  })).optional(),
});

// Application validation schemas
export const submitApplicationSchema = z.object({
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  experience: z.number().min(0, 'Experience must be positive').max(50),
  education: z.string().min(2, 'Education is required'),
  customAnswers: z.record(z.any()).optional(),
});

// File validation
export const validateFileUpload = (file: Express.Multer.File) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  
  if (!allowedMimes.includes(file.mimetype)) {
    throw new Error('Invalid file type. Only PDF and Word documents are allowed');
  }
  
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('File size exceeds 5MB limit');
  }
  
  return true;
};

// Pagination validation
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

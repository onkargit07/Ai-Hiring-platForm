// Seed script to create sample data for testing
// Run with: cd backend && npx ts-node prisma/seed.ts
/* eslint-disable no-console */

import { PrismaClient, UserRole, ApplicationStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.application.deleteMany();
  await prisma.jobPost.deleteMany();
  await prisma.user.deleteMany();

  // Create Recruiters
  console.log('Creating recruiters...');
  const recruiter1 = await prisma.user.create({
    data: {
      email: 'recruiter@example.com',
      password: await bcrypt.hash('password123', 10),
      fullName: 'John Recruiter',
      role: UserRole.RECRUITER,
    },
  });

  const recruiter2 = await prisma.user.create({
    data: {
      email: 'hr@techcorp.com',
      password: await bcrypt.hash('password123', 10),
      fullName: 'Sarah Johnson',
      role: UserRole.RECRUITER,
    },
  });

  // Create Candidates
  console.log('Creating candidates...');
  const candidate1 = await prisma.user.create({
    data: {
      email: 'candidate1@example.com',
      password: await bcrypt.hash('password123', 10),
      fullName: 'Alice Developer',
      role: UserRole.CANDIDATE,
    },
  });

  const candidate2 = await prisma.user.create({
    data: {
      email: 'candidate2@example.com',
      password: await bcrypt.hash('password123', 10),
      fullName: 'Bob Engineer',
      role: UserRole.CANDIDATE,
    },
  });

  const candidate3 = await prisma.user.create({
    data: {
      email: 'candidate3@example.com',
      password: await bcrypt.hash('password123', 10),
      fullName: 'Carol Designer',
      role: UserRole.CANDIDATE,
    },
  });

  // Create Job Posts
  console.log('Creating job posts...');
  const job1 = await prisma.jobPost.create({
    data: {
      title: 'Senior Full Stack Developer',
      description: `We are looking for an experienced Full Stack Developer to join our team.

Responsibilities:
- Develop and maintain web applications using React and Node.js
- Write clean, maintainable code
- Collaborate with cross-functional teams
- Participate in code reviews

Requirements:
- 5+ years of experience in web development
- Strong knowledge of React, TypeScript, and Node.js
- Experience with PostgreSQL or other relational databases
- Excellent problem-solving skills`,
      skillsRequired: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'REST API'],
      experienceLevel: 'Senior',
      location: 'New York, NY',
      isRemote: true,
      salaryMin: 120000,
      salaryMax: 160000,
      education: "Bachelor's degree in Computer Science or related field",
      customQuestions: [
        'Describe a challenging technical problem you solved recently.',
        'What is your experience with microservices architecture?',
        'How do you ensure code quality in your projects?',
      ],
      recruiterId: recruiter1.id,
    },
  });

  const job2 = await prisma.jobPost.create({
    data: {
      title: 'Frontend Developer',
      description: `Join our dynamic team as a Frontend Developer!

What you'll do:
- Build responsive user interfaces with React
- Implement pixel-perfect designs
- Optimize application performance
- Work closely with designers and backend developers

What we're looking for:
- 3+ years of frontend development experience
- Proficiency in React and modern JavaScript
- Strong CSS skills (TailwindCSS is a plus)
- Portfolio of previous work`,
      skillsRequired: ['React', 'JavaScript', 'CSS', 'HTML', 'TailwindCSS'],
      experienceLevel: 'Mid Level',
      location: 'San Francisco, CA',
      isRemote: false,
      salaryMin: 90000,
      salaryMax: 130000,
      education: "Bachelor's degree preferred",
      customQuestions: [
        'Share a link to your portfolio or GitHub profile.',
        'What is your favorite frontend framework and why?',
      ],
      recruiterId: recruiter2.id,
    },
  });

  const _job3 = await prisma.jobPost.create({
    data: {
      title: 'Backend Engineer (Node.js)',
      description: `We're seeking a talented Backend Engineer to help build scalable APIs.

Key Responsibilities:
- Design and implement RESTful APIs
- Optimize database queries and performance
- Write unit and integration tests
- Deploy and maintain cloud infrastructure

Requirements:
- 4+ years of backend development
- Expert-level Node.js and Express
- Experience with PostgreSQL, MongoDB, or similar
- Knowledge of Docker and cloud platforms (AWS/GCP)`,
      skillsRequired: ['Node.js', 'Express', 'PostgreSQL', 'Docker', 'AWS'],
      experienceLevel: 'Senior',
      location: 'Austin, TX',
      isRemote: true,
      salaryMin: 110000,
      salaryMax: 150000,
      education: "Bachelor's degree in Computer Science",
      recruiterId: recruiter1.id,
    },
  });

  const _job4 = await prisma.jobPost.create({
    data: {
      title: 'Junior React Developer',
      description: `Great opportunity for a junior developer to grow!

What you'll learn:
- Modern React development practices
- State management with Redux/Zustand
- API integration and data fetching
- Testing with Jest and React Testing Library

What we need:
- 1-2 years of experience with React
- Basic understanding of JavaScript and TypeScript
- Eagerness to learn and improve
- Team player with good communication skills`,
      skillsRequired: ['React', 'JavaScript', 'HTML', 'CSS'],
      experienceLevel: 'Junior',
      location: 'Remote',
      isRemote: true,
      salaryMin: 60000,
      salaryMax: 80000,
      recruiterId: recruiter2.id,
    },
  });

  // Create Sample Applications
  console.log('Creating sample applications...');
  
  // Application 1 - High match
  await prisma.application.create({
    data: {
      candidateId: candidate1.id,
      jobPostId: job1.id,
      resumeUrl: '/uploads/sample-resume-1.pdf',
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'REST API', 'Docker'],
      experience: '6 years of full-stack development with focus on React and Node.js',
      educationLevel: "Bachelor's Degree",
      portfolio: 'https://github.com/alicedeveloper',
      coverLetter: 'I am excited about this opportunity to join your team...',
      customAnswers: [
        'Recently optimized a complex data pipeline that reduced processing time by 60%',
        'Built and maintained microservices using Docker and Kubernetes',
        'Use ESLint, Prettier, unit tests, and code reviews',
      ],
      suitabilityScore: 92.5,
      status: ApplicationStatus.APPLIED,
    },
  });

  // Application 2 - Medium match
  await prisma.application.create({
    data: {
      candidateId: candidate2.id,
      jobPostId: job1.id,
      resumeUrl: '/uploads/sample-resume-2.pdf',
      skills: ['React', 'JavaScript', 'Node.js', 'MongoDB'],
      experience: '4 years of web development experience',
      educationLevel: "Bachelor's Degree",
      portfolio: 'https://github.com/bogengineer',
      coverLetter: 'I would like to apply for the Senior Full Stack position...',
      customAnswers: [
        'Implemented a new feature that increased user engagement',
        'Some experience with microservices, still learning',
        'Code reviews and testing',
      ],
      suitabilityScore: 78.3,
      status: ApplicationStatus.VIEWED,
    },
  });

  // Application 3 - Lower match
  await prisma.application.create({
    data: {
      candidateId: candidate3.id,
      jobPostId: job1.id,
      resumeUrl: '/uploads/sample-resume-3.pdf',
      skills: ['HTML', 'CSS', 'JavaScript', 'React'],
      experience: '2 years of frontend development',
      educationLevel: 'Associate Degree',
      coverLetter: 'I am interested in this position...',
      customAnswers: [
        'Built several React components',
        'Limited experience with backend',
        'Testing when possible',
      ],
      suitabilityScore: 54.7,
      status: ApplicationStatus.REJECTED,
    },
  });

  // Application for job 2
  await prisma.application.create({
    data: {
      candidateId: candidate1.id,
      jobPostId: job2.id,
      resumeUrl: '/uploads/sample-resume-1.pdf',
      skills: ['React', 'JavaScript', 'CSS', 'TailwindCSS', 'TypeScript'],
      experience: 'Strong frontend experience with modern frameworks',
      educationLevel: "Bachelor's Degree",
      portfolio: 'https://alicedev.com',
      coverLetter: 'Perfect fit for this frontend role...',
      customAnswers: [
        'https://github.com/alicedeveloper',
        'React because of its component-based architecture',
      ],
      suitabilityScore: 88.2,
      status: ApplicationStatus.SHORTLISTED,
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('\n📊 Created:');
  console.log('- 2 Recruiters');
  console.log('- 3 Candidates');
  console.log('- 4 Job Posts');
  console.log('- 4 Applications');
  console.log('\n🔐 Login credentials:');
  console.log('Recruiter: recruiter@example.com / password123');
  console.log('Recruiter: hr@techcorp.com / password123');
  console.log('Candidate: candidate1@example.com / password123');
  console.log('Candidate: candidate2@example.com / password123');
  console.log('Candidate: candidate3@example.com / password123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

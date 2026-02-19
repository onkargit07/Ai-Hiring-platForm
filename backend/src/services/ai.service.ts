import OpenAI from 'openai';
import { Prisma } from '@prisma/client';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface JobData {
  title: string;
  description: string;
  skillsRequired: string[];
  experienceLevel: string;
  education?: string | null;
}

interface CandidateData {
  skills: string[];
  experience: string;
  educationLevel?: string;
  portfolio?: string;
  coverLetter?: string;
}

export const scoreCandidate = async (
  job: JobData,
  candidate: CandidateData
): Promise<{ score: number; analysis: Prisma.JsonValue }> => {
  try {
    const prompt = `You are an AI recruiter assistant. Analyze the candidate's suitability for the job and provide a score from 0-100.

Job Details:
- Title: ${job.title}
- Description: ${job.description}
- Required Skills: ${job.skillsRequired.join(', ')}
- Experience Level: ${job.experienceLevel}
- Education: ${job.education || 'Not specified'}

Candidate Profile:
- Skills: ${candidate.skills.join(', ')}
- Experience: ${candidate.experience}
- Education: ${candidate.educationLevel || 'Not specified'}
- Portfolio: ${candidate.portfolio || 'Not provided'}
- Cover Letter: ${candidate.coverLetter || 'Not provided'}

Provide a JSON response with:
1. "score" (0-100): Overall suitability score
2. "skillsMatch" (0-100): How well candidate's skills match requirements
3. "experienceMatch" (0-100): How well experience level matches
4. "educationMatch" (0-100): How well education matches
5. "strengths" (array): Key strengths of the candidate
6. "weaknesses" (array): Areas where candidate may be lacking
7. "recommendation" (string): Brief recommendation for recruiter

Only return valid JSON, no additional text.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert AI recruiter. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    const analysis = JSON.parse(content);

    return {
      score: analysis.score,
      analysis
    };
  } catch (error) {
    console.error('AI scoring error:', error);
    // Fallback to basic scoring if AI fails
    return {
      score: calculateBasicScore(job, candidate),
      analysis: {
        score: calculateBasicScore(job, candidate),
        skillsMatch: 50,
        experienceMatch: 50,
        educationMatch: 50,
        strengths: ['Application submitted'],
        weaknesses: ['AI analysis unavailable'],
        recommendation: 'Manual review recommended'
      }
    };
  }
};

// Fallback scoring function
const calculateBasicScore = (job: JobData, candidate: CandidateData): number => {
  let score = 50; // Base score

  // Skills match
  const matchingSkills = candidate.skills.filter(skill =>
    job.skillsRequired.some(req => 
      req.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(req.toLowerCase())
    )
  );
  score += (matchingSkills.length / job.skillsRequired.length) * 30;

  // Experience match
  const expMap: { [key: string]: number } = {
    'entry': 1,
    'junior': 2,
    'mid': 3,
    'senior': 4,
    'lead': 5
  };
  
  const jobExpLevel = Object.keys(expMap).find(key => 
    job.experienceLevel.toLowerCase().includes(key)
  ) || 'mid';
  
  const candidateExpLevel = Object.keys(expMap).find(key => 
    candidate.experience.toLowerCase().includes(key)
  ) || 'mid';

  const expDiff = Math.abs(expMap[jobExpLevel] - expMap[candidateExpLevel]);
  score += Math.max(0, 20 - (expDiff * 5));

  return Math.min(100, Math.max(0, Math.round(score)));
};

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

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

interface AIAnalysisResult {
  score: number;
  analysis: {
    score: number;
    skillsMatch: number;
    experienceMatch: number;
    educationMatch: number;
    projectComplexityScore: number;
    experienceYears: number;
    isOverqualified: boolean; // Flagged if candidate experience >> job requirement
    overqualificationReason?: string; // Why they're overqualified
    projectComplexityBreakdown: {
      technicalDepth: number;
      innovation: number;
      scalability: number;
      realWorldImpact: number;
      complexityRelativeToExperience: number;
    };
    projects: Array<{
      name: string;
      complexity: number;
      technologies: string[];
      impact: string;
    }>;
    strengths: string[];
    weaknesses: string[];
    recommendation: string;
    tiebreakerMetrics: {
      overallFactor: number; // Combined metric for tie-breaking
      experienceDepthRatio: number; // Complexity vs years
    };
  };
  projectComplexityScore: number;
  experienceYears: number;
  isOverqualified: boolean;
}

/**
 * Score candidate using Google Gemini AI with enhanced project complexity analysis
 */
export const scoreCandidateWithGemini = async (
  job: JobData,
  candidate: CandidateData
): Promise<AIAnalysisResult> => {
  try {
    const prompt = `You are an expert AI recruiter with deep technical expertise. Analyze this candidate's suitability for the job with SPECIAL FOCUS on project complexity relative to their experience level.

**JOB REQUIREMENTS:**
- Title: ${job.title}
- Description: ${job.description}
- Required Skills: ${job.skillsRequired.join(', ')}
- Experience Level: ${job.experienceLevel}
- Education: ${job.education || 'Not specified'}

**CANDIDATE PROFILE:**
- Skills: ${candidate.skills.join(', ')}
- Experience Description: ${candidate.experience}
- Education: ${candidate.educationLevel || 'Not specified'}
- Portfolio: ${candidate.portfolio || 'Not provided'}
- Cover Letter: ${candidate.coverLetter || 'Not provided'}

**CRITICAL: OVERQUALIFICATION DETECTION & FAIRNESS:**
IMPORTANT: Prevent unfair advantage for overqualified candidates! Evaluate experience level match:

**Job requires**: ${job.experienceLevel}

If candidate's experience SIGNIFICANTLY EXCEEDS job requirement:
- Entry/Fresher job but candidate has 4+ years → OVERQUALIFIED
- Junior job but candidate has 7+ years → OVERQUALIFIED  
- Mid-level job but candidate has 10+ years → OVERQUALIFIED

**APPLY 15-25 POINT PENALTY** to overqualified candidates to ensure fairness for appropriately-leveled candidates.

**CRITICAL TIE-BREAKING ANALYSIS:**
When candidates have similar scores, project complexity becomes the deciding factor. Evaluate:

1. **Experience Years Extraction**: Extract the actual years of professional experience from the description (e.g., "5 years" → 5.0)

2. **Project Complexity Analysis** (0-100):
   - **Technical Depth (25%)**: Architecture complexity, advanced patterns, system design
   - **Innovation (25%)**: Use of cutting-edge tech, novel solutions, creative problem-solving
   - **Scalability (25%)**: Handles large scale, performance optimization, distributed systems
   - **Real-World Impact (25%)**: Business value, user base, production deployment

3. **Complexity-to-Experience Ratio**:
   - Entry-level (0-2 years): Expected complexity = 40-60
   - Junior (2-4 years): Expected complexity = 50-70
   - Mid-level (4-7 years): Expected complexity = 65-85
   - Senior (7-10 years): Expected complexity = 80-95
   - Lead (10+ years): Expected complexity = 90-100
   
   Award bonus points if complexity EXCEEDS expected level for experience (but apply penalty if overqualified!).

4. **Project Portfolio Analysis**: Identify 2-5 key projects from resume/portfolio/cover letter:
   - Project name
   - Complexity score (0-100)
   - Technologies used
   - Business/user impact

**SCORING BREAKDOWN:**
- Skills Match (30 points): Exact + related skill matches
- Experience Match (25 points): Level and years alignment
- Education Match (15 points): Degree and field relevance
- Project Complexity (20 points): Quality and depth of projects relative to experience
- Overall Fit (10 points): Culture, communication, career trajectory

**OUTPUT FORMAT (Valid JSON only):**
{
  "score": <0-100 overall suitability WITH penalty applied if overqualified>,
  "skillsMatch": <0-100>,
  "experienceMatch": <0-100>,
  "educationMatch": <0-100>,
  "projectComplexityScore": <0-100>,
  "experienceYears": <extracted years as float, e.g., 5.5>,
  "isOverqualified": <true if experience significantly exceeds job requirement>,
  "overqualificationReason": "Brief reason if overqualified, e.g., 'Senior candidate for entry-level position'",
  "projectComplexityBreakdown": {
    "technicalDepth": <0-100>,
    "innovation": <0-100>,
    "scalability": <0-100>,
    "realWorldImpact": <0-100>,
    "complexityRelativeToExperience": <0-100 - bonus if exceeds expected>
  },
  "projects": [
    {
      "name": "Project name",
      "complexity": <0-100>,
      "technologies": ["tech1", "tech2"],
      "impact": "Brief impact description"
    }
  ],
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2"],
  "recommendation": "Brief hiring recommendation (note if overqualified)",
  "tiebreakerMetrics": {
    "overallFactor": <weighted combination of projectComplexity + experienceYears + innovationScore>,
    "experienceDepthRatio": <projectComplexityScore / experienceYears ratio>
  }
}

Return ONLY valid JSON. No markdown, no explanation.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean response (remove markdown code blocks if present)
    const cleanedText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const analysis = JSON.parse(cleanedText);

    // Ensure all required fields exist
    const safeAnalysis = {
      score: analysis.score || 0,
      skillsMatch: analysis.skillsMatch || 0,
      experienceMatch: analysis.experienceMatch || 0,
      educationMatch: analysis.educationMatch || 0,
      projectComplexityScore: analysis.projectComplexityScore || 0,
      experienceYears: analysis.experienceYears || 0,
      isOverqualified: analysis.isOverqualified || false,
      overqualificationReason: analysis.overqualificationReason,
      projectComplexityBreakdown: analysis.projectComplexityBreakdown || {
        technicalDepth: 0,
        innovation: 0,
        scalability: 0,
        realWorldImpact: 0,
        complexityRelativeToExperience: 0
      },
      projects: analysis.projects || [],
      strengths: analysis.strengths || [],
      weaknesses: analysis.weaknesses || [],
      recommendation: analysis.recommendation || 'Manual review recommended',
      tiebreakerMetrics: analysis.tiebreakerMetrics || {
        overallFactor: 0,
        experienceDepthRatio: 0
      }
    };

    return {
      score: safeAnalysis.score,
      analysis: safeAnalysis,
      projectComplexityScore: safeAnalysis.projectComplexityScore,
      experienceYears: safeAnalysis.experienceYears,
      isOverqualified: safeAnalysis.isOverqualified
    };
  } catch (error) {
    console.error('Gemini AI scoring error:', error);
    // Fallback to enhanced basic scoring
    return fallbackEnhancedScoring(job, candidate);
  }
};

/**
 * Detect if candidate is overqualified for the position
 */
const detectOverqualification = (jobLevel: string, candidateYears: number): boolean => {
  const levelLower = jobLevel.toLowerCase();
  
  if ((levelLower.includes('entry') || levelLower.includes('fresher') || levelLower.includes('junior')) && candidateYears >= 4) {
    return true; // Senior applying to entry/junior
  }
  
  if (levelLower.includes('mid') && candidateYears >= 10) {
    return true; // Very senior applying to mid-level
  }
  
  if (levelLower.includes('senior') && candidateYears >= 15) {
    return true; // Lead/Executive applying to senior
  }
  
  return false;
};

/**
 * Enhanced fallback scoring with project complexity estimation
 */
const fallbackEnhancedScoring = (
  job: JobData,
  candidate: CandidateData
): AIAnalysisResult => {
  let score = 50; // Base score
  let projectComplexityScore = 50;
  let experienceYears = 0;

  // Extract experience years using regex
  const yearPatterns = [
    /(\d+\.?\d*)\s*(?:\+)?\s*years?/i,
    /(\d+\.?\d*)\s*yrs?/i,
    /experience:\s*(\d+\.?\d*)/i
  ];

  for (const pattern of yearPatterns) {
    const match = candidate.experience.match(pattern);
    if (match) {
      experienceYears = parseFloat(match[1]);
      break;
    }
  }

  // Skills match (30 points)
  const matchingSkills = candidate.skills.filter(skill =>
    job.skillsRequired.some(req => 
      req.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(req.toLowerCase())
    )
  );
  const skillsScore = (matchingSkills.length / Math.max(job.skillsRequired.length, 1)) * 30;
  score += skillsScore;

  // Experience match (25 points)
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
  const experienceScore = Math.max(0, 25 - (expDiff * 6));
  score += experienceScore;

  // Education match (15 points)
  if (candidate.educationLevel && job.education) {
    const educationScore = candidate.educationLevel.toLowerCase().includes(job.education.toLowerCase()) 
      ? 15 : 8;
    score += educationScore;
  } else {
    score += 8; // Partial credit if education not critical
  }

  // Project complexity estimation (20 points)
  let complexityEstimate = 50; // Base complexity
  
  // Advanced skills indicate higher complexity
  const advancedSkills = ['architecture', 'microservices', 'kubernetes', 'aws', 'azure', 
    'distributed', 'system design', 'machine learning', 'ai', 'blockchain'];
  const hasAdvancedSkills = candidate.skills.some(skill =>
    advancedSkills.some(advanced => skill.toLowerCase().includes(advanced))
  );
  
  if (hasAdvancedSkills) complexityEstimate += 20;
  if (candidate.portfolio) complexityEstimate += 15;
  if (candidate.coverLetter && candidate.coverLetter.length > 200) complexityEstimate += 15;

  projectComplexityScore = Math.min(100, complexityEstimate);
  score += (projectComplexityScore / 100) * 20;

  // Overall fit (10 points)
  const overallFit = candidate.coverLetter ? 10 : 5;
  score += overallFit;

  const finalScore = Math.min(100, Math.max(0, Math.round(score)));

  // Detect overqualification in fallback
  const isOverqualified = detectOverqualification(job.experienceLevel, experienceYears);
  const adjustedScore = isOverqualified ? Math.max(0, finalScore - 20) : finalScore;

  return {
    score: adjustedScore,
    analysis: {
      score: adjustedScore,
      skillsMatch: (skillsScore / 30) * 100,
      experienceMatch: (experienceScore / 25) * 100,
      educationMatch: 50,
      projectComplexityScore,
      experienceYears,
      isOverqualified,
      overqualificationReason: isOverqualified ? `${experienceYears} years experience for ${job.experienceLevel} position` : undefined,
      projectComplexityBreakdown: {
        technicalDepth: hasAdvancedSkills ? 70 : 40,
        innovation: 50,
        scalability: 50,
        realWorldImpact: candidate.portfolio ? 60 : 30,
        complexityRelativeToExperience: 50
      },
      projects: [],
      strengths: ['Application submitted', 'Skills match'],
      weaknesses: isOverqualified ? ['AI analysis unavailable - using fallback', 'May be overqualified'] : ['AI analysis unavailable - using fallback'],
      recommendation: isOverqualified ? 'Overqualified - Manual review recommended' : 'Manual review recommended - AI scoring failed',
      tiebreakerMetrics: {
        overallFactor: projectComplexityScore + (experienceYears * 5),
        experienceDepthRatio: experienceYears > 0 ? projectComplexityScore / experienceYears : 0
      }
    },
    projectComplexityScore,
    experienceYears,
    isOverqualified
  };
};

/**
 * Comprehensive tie-breaking comparison
 * Returns: -1 if a should come before b, 1 if b should come before a, 0 if equal
 */
export const compareApplicationsForRanking = (
  a: { 
    suitabilityScore?: number | null; 
    projectComplexityScore?: number | null;
    experienceYears?: number | null;
    createdAt: Date;
  },
  b: { 
    suitabilityScore?: number | null; 
    projectComplexityScore?: number | null;
    experienceYears?: number | null;
    createdAt: Date;
  }
): number => {
  // Level 1: Suitability Score (primary)
  const scoreA = a.suitabilityScore || 0;
  const scoreB = b.suitabilityScore || 0;
  
  if (scoreA !== scoreB) {
    return scoreB - scoreA; // Descending order
  }

  // Level 2: Project Complexity (tie-breaker #1)
  const complexityA = a.projectComplexityScore || 0;
  const complexityB = b.projectComplexityScore || 0;
  
  if (complexityA !== complexityB) {
    return complexityB - complexityA; // Higher complexity wins
  }

  // Level 3: Experience Years (tie-breaker #2)
  const expA = a.experienceYears || 0;
  const expB = b.experienceYears || 0;
  
  if (expA !== expB) {
    return expB - expA; // More experience wins
  }

  // Level 4: Application timestamp (tie-breaker #3 - who applied first)
  return a.createdAt.getTime() - b.createdAt.getTime(); // Earlier application wins
};

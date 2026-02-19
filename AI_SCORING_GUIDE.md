# AI Scoring System Documentation

## Overview

The AI Hiring Platform uses OpenAI's GPT-4 to automatically analyze and score candidates based on how well they match job requirements. This document explains how the AI scoring works.

## How It Works

When a candidate submits an application:

1. **Data Collection**: The system gathers:
   - Job requirements (title, description, skills, experience level, education)
   - Candidate information (skills, experience, education, portfolio, cover letter)
   - Resume (uploaded file)

2. **AI Analysis**: OpenAI GPT-4 analyzes the match between job and candidate

3. **Score Calculation**: AI generates a comprehensive score (0-100)

4. **Ranking**: Applications are automatically sorted by score (highest first)

## Scoring Criteria

### 1. Skills Match (30 points)
- Compares candidate skills with job requirements
- Exact matches score higher
- Related/similar skills receive partial credit
- Example:
  - Job requires: React, Node.js, TypeScript
  - Candidate has: React, Node.js, JavaScript
  - Score: ~25/30 (missing TypeScript but has JavaScript)

### 2. Experience Match (30 points)
- Evaluates years and type of experience
- Matches experience level (Entry/Junior/Mid/Senior/Lead)
- Considers industry relevance
- Example:
  - Job requires: 5+ years, Senior level
  - Candidate has: 6 years, Senior level
  - Score: ~28/30 (excellent match)

### 3. Education Match (20 points)
- Compares education requirements
- Considers degree level and field of study
- Optional field - not required for all jobs
- Example:
  - Job prefers: Bachelor's in Computer Science
  - Candidate has: Bachelor's in Computer Science
  - Score: 20/20 (perfect match)

### 4. Overall Fit (20 points)
- Analyzes cover letter quality and relevance
- Reviews portfolio/projects if provided
- Assesses communication skills
- Evaluates career trajectory alignment
- Example:
  - Strong, tailored cover letter: +15 points
  - Relevant portfolio: +5 points
  - Generic application: +5 points

## Score Interpretation

| Score Range | Interpretation | Action |
|-------------|---------------|---------|
| 90-100 | Excellent Match | Top priority - Interview immediately |
| 80-89 | Very Good Match | Strong candidate - Schedule interview |
| 70-79 | Good Match | Review carefully - Consider for interview |
| 60-69 | Moderate Match | May lack some requirements - Review |
| 50-59 | Weak Match | Missing key requirements - Likely reject |
| 0-49 | Poor Match | Not suitable for this role |

## AI Output Components

The AI provides detailed analysis:

```json
{
  "score": 85,
  "skillsMatch": 90,
  "experienceMatch": 85,
  "educationMatch": 80,
  "strengths": [
    "Strong React and TypeScript experience",
    "Relevant previous projects",
    "Clear communication in cover letter"
  ],
  "weaknesses": [
    "Limited experience with Docker",
    "No mention of CI/CD pipelines"
  ],
  "recommendation": "Strong candidate with excellent technical skills. Recommend phone screening to discuss DevOps experience."
}
```

## Top 10 Highlighting

Candidates ranked in the top 10 positions receive:
- ⭐ Visual indicator
- Yellow highlight background
- Priority badge

This helps recruiters focus on the best matches first.

## Fallback Scoring

If the OpenAI API is unavailable or fails:

1. **Basic Algorithm Activates**: A rule-based scoring system takes over
2. **Skills Matching**: Counts exact and partial skill matches
3. **Experience Comparison**: Uses simple level mapping
4. **Base Score**: Starts at 50 points
5. **Skill Bonus**: +30 points for skill matches
6. **Experience Bonus**: +20 points for level match

Example fallback calculation:
```
Base Score: 50
Skills: 5 out of 8 required → +19 points
Experience: Matching level → +20 points
Total: 89/100
```

## Best Practices for Candidates

To get a higher AI score:

### ✅ Do This:
- List ALL relevant skills (include variations)
- Be specific about years of experience
- Provide a tailored cover letter
- Include a portfolio link
- Answer screening questions thoroughly
- Upload an updated, well-formatted resume

### ❌ Avoid This:
- Generic "copy-paste" applications
- Missing resume upload
- Incomplete skill lists
- Vague experience descriptions
- Skipping optional fields

## Best Practices for Recruiters

To get accurate AI rankings:

### ✅ Do This:
- Be specific about required skills
- Clearly define experience level
- Add relevant screening questions
- Provide detailed job descriptions
- Specify education requirements if important

### ❌ Avoid This:
- Vague job descriptions
- Too many or too few required skills
- Ambiguous experience requirements
- Missing key information

## AI Limitations

The AI scoring system is a tool to assist hiring, not replace it:

1. **Not Perfect**: AI may miss nuances in applications
2. **Context Blind**: Cannot see cultural fit or personality
3. **Resume Dependent**: Quality depends on information provided
4. **No Interviews**: Cannot replace human interaction
5. **Bias Awareness**: AI trained on existing data may have biases

**Always review applications manually before making final decisions.**

## Privacy & Security

- Resume files are stored securely on the server
- AI analysis does not store personal data in OpenAI
- Only job requirements and application text are sent to AI
- Candidate information is protected by authentication
- Resumes are only accessible to the job's recruiter

## Technical Details

### API Integration
```typescript
// Simplified example
const aiAnalysis = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: 'You are an expert AI recruiter...' },
    { role: 'user', content: jobAndCandidateData }
  ],
  temperature: 0.3,  // Lower = more consistent
  max_tokens: 1000
});
```

### Performance
- Average analysis time: 2-5 seconds per candidate
- Concurrent processing: Up to 5 candidates simultaneously
- Caching: Scores are stored and not recalculated

### Cost Considerations
- Each analysis costs approximately $0.01-0.03 (GPT-4 pricing)
- Fallback system activates if quota exceeded
- Can be configured to use GPT-3.5 for lower costs

## Customization Options

In `backend/src/services/ai.service.ts`, you can modify:

```typescript
// Change AI model
model: 'gpt-4'           // High accuracy, higher cost
model: 'gpt-3.5-turbo'   // Good accuracy, lower cost

// Adjust temperature
temperature: 0.3   // More consistent
temperature: 0.7   // More creative/varied

// Modify scoring weights
const weights = {
  skills: 0.30,      // 30% weight
  experience: 0.30,  // 30% weight
  education: 0.20,   // 20% weight
  overall: 0.20      // 20% weight
};
```

## FAQ

**Q: Can candidates see their AI score?**
A: Yes, candidates can see their suitability score on their application status page.

**Q: Are scores final?**
A: No, recruiters can manually override by changing application status regardless of score.

**Q: What if AI gives a bad candidate high score?**
A: Always review manually. AI is a filter, not a final decision maker.

**Q: Can I disable AI scoring?**
A: Yes, applications will still work but won't be automatically ranked. Remove the AI call in `application.controller.ts`.

**Q: How often are scores updated?**
A: Scores are calculated once when application is submitted and remain fixed.

---

**The AI scoring system is designed to save you time by surfacing the best candidates first, but human judgment remains essential for final hiring decisions.**

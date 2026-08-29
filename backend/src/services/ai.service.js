const { GoogleGenAI } = require("@google/genai")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

// Gemini schema for standard Interview Preparation Plan
const interviewReportGeminiSchema = {
    type: "object",
    properties: {
        title: {
            type: "string",
            description: "The job title / role for which the interview report is generated (e.g. 'Senior Frontend Engineer')"
        },
        matchScore: {
            type: "number",
            description: "A score between 0 and 100 indicating how well the candidate's profile matches the job description"
        },
        technicalQuestions: {
            type: "array",
            description: "Technical questions that can be asked in the interview along with their intention and model answer",
            items: {
                type: "object",
                properties: {
                    question: { type: "string", description: "The technical question" },
                    intention: { type: "string", description: "The interviewer's intention behind asking this question" },
                    answer: { type: "string", description: "How to answer — key points, approach, what to cover" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: "array",
            description: "Behavioral questions that can be asked in the interview along with their intention and model answer",
            items: {
                type: "object",
                properties: {
                    question: { type: "string", description: "The behavioral question" },
                    intention: { type: "string", description: "The interviewer's intention behind asking this question" },
                    answer: { type: "string", description: "How to answer — key points, approach, what to cover" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: "array",
            description: "Skills the candidate is lacking relative to the job description",
            items: {
                type: "object",
                properties: {
                    skill: { type: "string", description: "The skill the candidate is lacking" },
                    severity: {
                        type: "string",
                        enum: ["low", "medium", "high"],
                        description: "How critical this skill gap is for the role"
                    }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: "array",
            description: "A day-by-day 7-day preparation plan for the candidate",
            items: {
                type: "object",
                properties: {
                    day: { type: "number", description: "Day number starting from 1" },
                    focus: { type: "string", description: "Main topic/focus for this day" },
                    tasks: {
                        type: "array",
                        items: { type: "string" },
                        description: "List of concrete tasks to complete on this day"
                    }
                },
                required: ["day", "focus", "tasks"]
            }
        }
    },
    required: ["title", "matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"]
}

// Gemini schema for In-Depth Skill Analysis & Career Roadmap
const careerRoadmapGeminiSchema = {
    type: "object",
    properties: {
        title: {
            type: "string",
            description: "The target job title or career transition role"
        },
        matchScore: {
            type: "number",
            description: "Overall role readiness / alignment score between 0 and 100"
        },
        skillAnalysis: {
            type: "array",
            description: "Detailed proficiency gap matrix for 5-8 essential skills required by the job",
            items: {
                type: "object",
                properties: {
                    skill: { type: "string", description: "Name of the skill or technology (e.g. Distributed Systems, Kubernetes)" },
                    currentLevel: { type: "string", description: "Candidate estimated current proficiency: 'None', 'Beginner', 'Intermediate', 'Advanced'" },
                    targetLevel: { type: "string", description: "Required proficiency level: 'Intermediate', 'Proficient', 'Advanced', 'Expert'" },
                    gapDescription: { type: "string", description: "Specific competency gap analysis and why it matters for this role" },
                    importance: { type: "string", enum: ["Critical", "High", "Medium", "Low"], description: "Importance priority for candidate's career progression" }
                },
                required: ["skill", "currentLevel", "targetLevel", "gapDescription", "importance"]
            }
        },
        careerRoadmap: {
            type: "array",
            description: "3 to 4 chronological phases for a multi-week roadmap to bridge gaps and qualify for this role",
            items: {
                type: "object",
                properties: {
                    phase: { type: "string", description: "Phase name (e.g., 'Phase 1: Core Architecture Foundations')" },
                    duration: { type: "string", description: "Timeline (e.g., 'Weeks 1-3')" },
                    objective: { type: "string", description: "Primary goal and mastery target of this phase" },
                    topics: {
                        type: "array",
                        items: { type: "string" },
                        description: "Key concepts, tools, and technical topics to learn and master"
                    },
                    projectToBuild: {
                        type: "object",
                        properties: {
                            title: { type: "string", description: "Hands-on project title to prove competency" },
                            description: { type: "string", description: "Project scope, architecture, and what it demonstrates" },
                            techStack: {
                                type: "array",
                                items: { type: "string" },
                                description: "Technologies and libraries to use in this project"
                            }
                        },
                        required: ["title", "description", "techStack"]
                    }
                },
                required: ["phase", "duration", "objective", "topics", "projectToBuild"]
            }
        },
        skillGaps: {
            type: "array",
            description: "Summary list of identified skill gaps",
            items: {
                type: "object",
                properties: {
                    skill: { type: "string" },
                    severity: { type: "string", enum: ["low", "medium", "high"] }
                },
                required: ["skill", "severity"]
            }
        },
        technicalQuestions: {
            type: "array",
            description: "3-5 high-impact technical interview validation questions",
            items: {
                type: "object",
                properties: {
                    question: { type: "string" },
                    intention: { type: "string" },
                    answer: { type: "string" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: "array",
            description: "2-3 leadership / situational behavioral questions",
            items: {
                type: "object",
                properties: {
                    question: { type: "string" },
                    intention: { type: "string" },
                    answer: { type: "string" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        preparationPlan: {
            type: "array",
            description: "Day-by-day quick start orientation plan",
            items: {
                type: "object",
                properties: {
                    day: { type: "number" },
                    focus: { type: "string" },
                    tasks: { type: "array", items: { type: "string" } }
                },
                required: ["day", "focus", "tasks"]
            }
        }
    },
    required: ["title", "matchScore", "skillAnalysis", "careerRoadmap", "skillGaps", "technicalQuestions", "behavioralQuestions", "preparationPlan"]
}


async function generateInterviewReport({ resume, selfDescription, jobDescription, planType = "interview" }) {

    if (planType === "roadmap") {
        const prompt = `You are an expert Executive Career Strategist and Technical Hiring Architect.
Analyze the target job description against the candidate's profile to generate an in-depth, structured Skill Gap Matrix & Multi-Week Career Transition Roadmap.

Job Description:
${jobDescription}

Candidate Resume:
${resume || "(No resume provided)"}

Candidate Experience Summary:
${selfDescription || "(No summary provided)"}

Please produce:
1. title: Target role title.
2. matchScore: Overall alignment score (0-100).
3. skillAnalysis: Deep-dive matrix analyzing 5-8 core competencies (currentLevel vs targetLevel, specific gap description, importance).
4. careerRoadmap: 3-4 structured phases with clear durations (e.g. Weeks 1-3, Weeks 4-6), objectives, topics to master, and a concrete resume-worthy hands-on project with techStack for each phase.
5. skillGaps: High-level overview of missing skills and severities.
6. technicalQuestions: 3-5 core technical validation questions with model answers.
7. behavioralQuestions: 2-3 behavioral questions.
8. preparationPlan: A 7-day kickoff plan.
`

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: careerRoadmapGeminiSchema,
            }
        })

        const parsed = JSON.parse(response.text)
        if (!parsed.title) {
            parsed.title = jobDescription.split('\n')[0].substring(0, 80).trim() || "Career & Skill Roadmap"
        }
        return parsed
    }

    // Standard Interview Plan
    const prompt = `Generate a comprehensive interview preparation report for a candidate applying for a job.

Job Description:
${jobDescription}

Candidate Resume:
${resume || "(No resume provided)"}

Candidate Self-Description:
${selfDescription || "(No self-description provided)"}

Generate the report with:
- title: the job title/role being applied for
- matchScore: how well the candidate matches (0-100)
- 5-8 technical questions with intentions and model answers
- 4-6 behavioral questions with intentions and model answers
- skill gaps the candidate needs to address
- a 7-day preparation plan with daily tasks
`

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: interviewReportGeminiSchema,
        }
    })

    const parsed = JSON.parse(response.text)

    // Safety fallback: ensure title is never undefined
    if (!parsed.title) {
        parsed.title = jobDescription.split('\n')[0].substring(0, 80).trim() || "Interview Report"
    }

    return parsed
}


module.exports = { generateInterviewReport }
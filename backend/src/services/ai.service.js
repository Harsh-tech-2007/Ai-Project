const { GoogleGenAI } = require("@google/genai")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

// Shared Resource Schema for Phase-Level Resources
const phaseResourceGeminiSchema = {
    type: "object",
    properties: {
        title: { type: "string", description: "Name of the resource or tutorial (e.g. 'Kubernetes Official Documentation - Core Concepts')" },
        type: { 
            type: "string", 
            enum: ["Documentation", "Course", "Book", "Video", "Practice", "Article", "Tool"],
            description: "Type of learning resource" 
        },
        platform: { type: "string", description: "Source/Platform (e.g. 'Official Docs', 'YouTube', 'Coursera', 'GitHub')" },
        url: { type: "string", description: "Representative URL or direct search path (e.g. 'https://kubernetes.io/docs/concepts/')" },
        description: { type: "string", description: "Specific takeaways and what to study in this resource" }
    },
    required: ["title", "type", "platform", "description"]
}

// Top-Level Categorized Resource Schema
const categorizedResourceGeminiSchema = {
    type: "object",
    properties: {
        category: { 
            type: "string", 
            enum: [
                "Websites & Documentation", 
                "YouTube & Video Channels", 
                "Recommended Books", 
                "Interactive Practice & Platforms"
            ],
            description: "Resource category" 
        },
        title: { type: "string", description: "Title of the resource, channel, book, or website" },
        platform: { type: "string", description: "Platform or author/publisher (e.g. 'O'Reilly', 'Hussein Nasser', 'MDN', 'NeetCode')" },
        url: { type: "string", description: "Resource URL" },
        description: { type: "string", description: "Why this resource is essential for mastering the role's competencies" }
    },
    required: ["category", "title", "platform", "description"]
}

// Gemini schema for standard Interview Preparation Plan
const interviewReportGeminiSchema = {
    type: "object",
    properties: {
        title: {
            type: "string",
            description: "The job title / role for which the interview report is generated (e.g. 'Senior Full Stack Engineer')"
        },
        matchScore: {
            type: "number",
            description: "A score between 0 and 100 indicating how well the candidate's profile matches the job description"
        },
        technicalQuestions: {
            type: "array",
            description: "10-12 technical interview questions with interviewer intentions and comprehensive model answers",
            items: {
                type: "object",
                properties: {
                    question: { type: "string", description: "The technical question" },
                    intention: { type: "string", description: "The interviewer's underlying intention / evaluation criteria" },
                    answer: { type: "string", description: "Comprehensive, structured model answer covering core concepts, architecture tradeoffs, and best practices" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: "array",
            description: "6-8 behavioral questions with intentions and STAR-method model answers",
            items: {
                type: "object",
                properties: {
                    question: { type: "string", description: "The behavioral question" },
                    intention: { type: "string", description: "What competency or soft skill the interviewer is assessing" },
                    answer: { type: "string", description: "Structured model response using the STAR method (Situation, Task, Action, Result)" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: "array",
            description: "Identified competency and skill gaps relative to the job requirements",
            items: {
                type: "object",
                properties: {
                    skill: { type: "string", description: "The specific skill or technology" },
                    severity: {
                        type: "string",
                        enum: ["low", "medium", "high"],
                        description: "Severity of the gap"
                    }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: "array",
            description: "A 7 to 14 day structured preparation sprint",
            items: {
                type: "object",
                properties: {
                    day: { type: "number", description: "Day index starting from 1" },
                    focus: { type: "string", description: "Core thematic focus for this day" },
                    tasks: {
                        type: "array",
                        items: { type: "string" },
                        description: "Actionable study, coding, or review tasks"
                    }
                },
                required: ["day", "focus", "tasks"]
            }
        },
        resources: {
            type: "array",
            description: "Curated industry learning resources, definitive documentation, YouTube channels, and books",
            items: categorizedResourceGeminiSchema
        }
    },
    required: ["title", "matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan", "resources"]
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
            description: "Detailed proficiency gap matrix for 6-10 essential competencies required by the target role",
            items: {
                type: "object",
                properties: {
                    skill: { type: "string", description: "Skill or technology name (e.g. Distributed Systems, PostgreSQL Optimization, System Design)" },
                    currentLevel: { type: "string", description: "Candidate estimated level: 'None', 'Beginner', 'Intermediate', 'Advanced'" },
                    targetLevel: { type: "string", description: "Target level required: 'Intermediate', 'Proficient', 'Advanced', 'Expert'" },
                    gapDescription: { type: "string", description: "Analysis of the specific competency gap and its importance for this position" },
                    importance: { type: "string", enum: ["Critical", "High", "Medium", "Low"], description: "Strategic priority level" }
                },
                required: ["skill", "currentLevel", "targetLevel", "gapDescription", "importance"]
            }
        },
        careerRoadmap: {
            type: "array",
            description: "3 to 5 structured chronological phases for a multi-week transition roadmap",
            items: {
                type: "object",
                properties: {
                    phase: { type: "string", description: "Phase title (e.g., 'Phase 1: Advanced Backend Architecture & Concurrency')" },
                    duration: { type: "string", description: "Timeline (e.g., 'Weeks 1-3' or 'Month 1')" },
                    objective: { type: "string", description: "Primary goal, milestone, and mastery criteria for this phase" },
                    topics: {
                        type: "array",
                        items: { type: "string" },
                        description: "Core technical concepts, architectural patterns, and tools to master"
                    },
                    projectToBuild: {
                        type: "object",
                        properties: {
                            title: { type: "string", description: "Hands-on, portfolio-worthy project to demonstrate mastery" },
                            description: { type: "string", description: "Detailed project scope, architecture, core features, and real-world relevance" },
                            techStack: {
                                type: "array",
                                items: { type: "string" },
                                description: "Modern technologies, frameworks, and libraries to implement"
                            }
                        },
                        required: ["title", "description", "techStack"]
                    },
                    resources: {
                        type: "array",
                        description: "2-4 high-value curated learning resources specifically for this roadmap phase (docs, courses, books, repos)",
                        items: phaseResourceGeminiSchema
                    }
                },
                required: ["phase", "duration", "objective", "topics", "projectToBuild", "resources"]
            }
        },
        skillGaps: {
            type: "array",
            description: "High-level summary list of identified skill gaps and severities",
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
            description: "4-6 core technical validation questions to verify phase milestone mastery",
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
            description: "3-4 leadership, communication, and situational behavioral questions",
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
            description: "Quick-start 7-day orientation sprint to kick off the roadmap",
            items: {
                type: "object",
                properties: {
                    day: { type: "number" },
                    focus: { type: "string" },
                    tasks: { type: "array", items: { type: "string" } }
                },
                required: ["day", "focus", "tasks"]
            }
        },
        resources: {
            type: "array",
            description: "Curated comprehensive learning resources categorized across Documentation, YouTube, Books, and Interactive Practice",
            items: categorizedResourceGeminiSchema
        }
    },
    required: ["title", "matchScore", "skillAnalysis", "careerRoadmap", "skillGaps", "technicalQuestions", "behavioralQuestions", "preparationPlan", "resources"]
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
3. skillAnalysis: Deep-dive matrix analyzing 7-10 core competencies (currentLevel vs targetLevel, specific gap description, importance).
4. careerRoadmap: 4-5 structured phases with clear durations (e.g. Weeks 1-3, Weeks 4-6), objectives, topics to master, and a concrete resume-worthy hands-on project with techStack for each phase.
5. skillGaps: High-level overview of missing skills and severities.
6. technicalQuestions: 3-5 core technical validation questions with model answers.
7. behavioralQuestions: 2-3 behavioral questions.
8. preparationPlan: A 7 to 14 days kickoff plan.
9. resources: Provide top-tier resources categorized across (atleast 3-4 youtube channels and 2-3 wesbites):
   * "Websites & Documentation" (e.g. MDN, Kubernetes Docs, System Design Primer,w3school,greeks for greeks, npm,github repository)
   * "YouTube & Video Channels" (e.g. Hussein Nasser, ByteByteGo, Traversy Media, ArjanCodes,apan college, complete coding , piyush garg, CodeWithHarry,take u froward, codehelp by babbar,Sheryians Coding School,freeCodeCamp.org,bro code,chai aur code)
   * "Recommended Books" (e.g. "Designing Data-Intensive Applications", "Clean Architecture", "Database Internals")
   * "Interactive Practice & Platforms" (e.g. LeetCode, Frontend Masters, Exercism, Roadmaps.sh)
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
- 6-8 technical questions with intentions and model answers
- 6-8 behavioral questions with intentions and model answers
- in detail skill gaps the candidate needs to address
- a 7 to 14 days preparation plan with daily tasks
- curated learning resources
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

    if (!parsed.title) {
        parsed.title = jobDescription.split('\n')[0].substring(0, 80).trim() || "Interview Report"
    }

    return parsed
}

module.exports = { generateInterviewReport }
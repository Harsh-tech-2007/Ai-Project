const { GoogleGenAI } = require("@google/genai")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

// Gemini native schema format (not JSON Schema / zodToJsonSchema)
// zodToJsonSchema output is standard JSON Schema which Gemini doesn't fully honour,
// causing fields like `title` to be dropped from the response.
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
            description: "Technical questions that can be asked in the interview along with their intention and how to answer them",
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
            description: "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
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
            description: "A day-by-day preparation plan for the candidate",
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


async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

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

    // Safety fallback: ensure title is never undefined (prevents Mongoose validation error)
    if (!parsed.title) {
        parsed.title = jobDescription.split('\n')[0].substring(0, 80).trim() || "Interview Report"
    }

    return parsed
}


module.exports = { generateInterviewReport }
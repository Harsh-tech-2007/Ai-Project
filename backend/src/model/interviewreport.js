const mongoose = require('mongoose');


const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [ true, "Technical question is required" ]
    },
    intention: {
        type: String,
        required: [ true, "Intention is required" ]
    },
    answer: {
        type: String,
        required: [ true, "Answer is required" ]
    }
}, {
    _id: false
})

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [ true, "Behavioral question is required" ]
    },
    intention: {
        type: String,
        required: [ true, "Intention is required" ]
    },
    answer: {
        type: String,
        required: [ true, "Answer is required" ]
    }
}, {
    _id: false
})

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [ true, "Skill is required" ]
    },
    severity: {
        type: String,
        enum: [ "low", "medium", "high" ],
        required: [ true, "Severity is required" ]
    }
}, {
    _id: false
})

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [ true, "Day is required" ]
    },
    focus: {
        type: String,
        required: [ true, "Focus is required" ]
    },
    tasks: [ {
        type: String,
        required: [ true, "Task is required" ]
    } ]
}, {
    _id: false
})

const skillAnalysisSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: true
    },
    currentLevel: {
        type: String,
        default: "Beginner"
    },
    targetLevel: {
        type: String,
        default: "Proficient"
    },
    gapDescription: {
        type: String,
        default: ""
    },
    importance: {
        type: String,
        enum: [ "Critical", "High", "Medium", "Low" ],
        default: "High"
    }
}, {
    _id: false
})

const projectToBuildSchema = new mongoose.Schema({
    title: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    },
    techStack: [ {
        type: String
    } ]
}, {
    _id: false
})

const careerRoadmapPhaseSchema = new mongoose.Schema({
    phase: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    objective: {
        type: String,
        required: true
    },
    topics: [ {
        type: String
    } ],
    projectToBuild: projectToBuildSchema
}, {
    _id: false
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [ true, "Job description is required" ]
    },
    resume: {
        type: String,
    },
    selfDescription: {
        type: String,
    },
    planType: {
        type: String,
        enum: [ "interview", "roadmap" ],
        default: "interview"
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    technicalQuestions: [ technicalQuestionSchema ],
    behavioralQuestions: [ behavioralQuestionSchema ],
    skillGaps: [ skillGapSchema ],
    preparationPlan: [ preparationPlanSchema ],
    skillAnalysis: [ skillAnalysisSchema ],
    careerRoadmap: [ careerRoadmapPhaseSchema ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    title: {
        type: String,
        required: [ true, "Job title is required" ]
    }
}, {
    timestamps: true
})


const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema);

module.exports = interviewReportModel;
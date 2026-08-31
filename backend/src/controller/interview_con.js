const { PDFParse } = require("pdf-parse")
const { generateInterviewReport } = require("../services/ai.service")
const interviewReportModel = require("../model/interviewreport");


/**
 * @route POST /api/interview/
 * @description Controller to generate interview report based on user self description, resume and job description.
 * @access private
 */
async function generateInterViewReportController(req, res) {
    try {
        const { selfDescription, jobDescription, planType = "interview" } = req.body

        if (!jobDescription) {
            return res.status(400).json({ message: "Job description is required." })
        }

        // Parse PDF if a file was uploaded; otherwise use text-only mode
        let resumeText = ""
        if (req.file) {
            // pdf-parse v2: PDFParse is a class — pass { data: Uint8Array }, then call getText()
            const parser = new PDFParse({ data: Uint8Array.from(req.file.buffer) })
            const resumeContent = await parser.getText()
            resumeText = resumeContent.text
        }

        if (!resumeText && !selfDescription) {
            return res.status(400).json({ message: "Please provide a resume (PDF) or a self-description." })
        }

        const selectedPlanType = planType === "roadmap" ? "roadmap" : "interview"

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription,
            planType: selectedPlanType
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            planType: selectedPlanType,
            ...interViewReportByAi,
            // Belt-and-suspenders: ensure title is never missing even if AI drops the field
            title: interViewReportByAi.title || jobDescription.split('\n')[0].substring(0, 80).trim() || (selectedPlanType === "roadmap" ? "Career Roadmap" : "Interview Report")
        })

        res.status(201).json({
            message: "Report generated successfully.",
            interviewReport
        })
    } catch (err) {
        console.error("Generate report error:", err.message)
        if (err.cause) console.error("Caused by:", err.cause.message)
        res.status(500).json({ message: err.message || "Internal server error" })
    }
}

/**
 * @route GET /api/interview/report/:interviewId
 * @description Controller to get interview report by interviewId.
 * @access private
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params

        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        })
    } catch (err) {
        console.error("Get report by ID error:", err.message)
        res.status(500).json({ message: "Internal server error" })
    }
}


/**
 * @route GET /api/interview/
 * @description Controller to get all interview reports of logged in user.
 * @access private
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan -skillAnalysis -careerRoadmap -resources")

        res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        })
    } catch (err) {
        console.error("Get all reports error:", err.message)
        res.status(500).json({ message: "Internal server error" })
    }
}


module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController }
const express = require("express");
const interviewRouter = express.Router();
const authMiddlewar = require("../middleware/auth_mid");
const interviewController = require('../controller/interview_con');
const upload = require('../middleware/file_mid');

/**
 * @route POST /api/interview/
 * @description Generate interview report based on user self description, resume and job description.
 * @access private
 */
interviewRouter.post('/', authMiddlewar.authUser, upload.single('resume'), interviewController.generateInterViewReportController);

/**
 * @route GET /api/interview/report/:interviewId
 * @description Get interview report by interviewId.
 * @access private
 */
interviewRouter.get("/report/:interviewId", authMiddlewar.authUser, interviewController.getInterviewReportByIdController)

/**
 * @route GET /api/interview/
 * @description Get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/", authMiddlewar.authUser, interviewController.getAllInterviewReportsController)

// NOTE: Resume PDF generation (/resume/pdf/:id) route is intentionally removed.
// The generateResumePdfController is not implemented yet.

module.exports = interviewRouter;

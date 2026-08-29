import { getAllInterviewReports, generateInterviewReport, getInterviewReportById } from "../services/interview_api"
import { useContext } from "react"
import { InterviewContext } from "../interview.context.jsx"


export const useInterview = () => {

    const context = useContext(InterviewContext)

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile, planType = "interview" }) => {
        setLoading(true)
        let interviewReport = null
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile, planType })
            interviewReport = response.interviewReport
            setReport(interviewReport)
        } catch (error) {
            console.error("generateReport error:", error)
        } finally {
            setLoading(false)
        }
        return interviewReport
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let interviewReport = null
        try {
            const response = await getInterviewReportById(interviewId)
            interviewReport = response.interviewReport
            setReport(interviewReport)
        } catch (error) {
            console.error("getReportById error:", error)
        } finally {
            setLoading(false)
        }
        return interviewReport
    }

    const getReports = async () => {
        setLoading(true)
        let interviewReports = null
        try {
            const response = await getAllInterviewReports()
            interviewReports = response.interviewReports
            setReports(interviewReports)
        } catch (error) {
            console.error("getReports error:", error)
        } finally {
            setLoading(false)
        }
        return interviewReports
    }

    return { loading, report, reports, generateReport, getReportById, getReports }
}
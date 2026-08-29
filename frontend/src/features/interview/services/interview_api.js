import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:4000",
    withCredentials: true,
})


/**
 * @description Service to generate interview report or career roadmap based on user self description, resume and job description.
 * NOTE: Do NOT pass a Content-Type header — axios sets it automatically with the correct
 * multipart boundary when a FormData body is used.
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile, planType = "interview" }) => {

    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    formData.append("planType", planType)
    if (resumeFile) {
        formData.append("resume", resumeFile)
    }

    const response = await api.post("/api/interview/", formData)
    return response.data
}


/**
 * @description Service to get interview report by interviewId.
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`)
    return response.data
}


/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/")
    return response.data
}

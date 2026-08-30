import React, { useState, useRef, useEffect } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/use.interview'
import { useAuth } from '../../auth/hooks/use.auth'
import { useNavigate } from 'react-router'

const Home = () => {

    const { loading, generateReport, reports, getReports } = useInterview()
    const { user, handleLogout } = useAuth()
    const [ jobDescription, setJobDescription ] = useState("")
    const [ selfDescription, setSelfDescription ] = useState("")
    const [ selectedFile, setSelectedFile ] = useState(null)
    const [ formError, setFormError ] = useState("")
    const [ isGenerating, setIsGenerating ] = useState(false)
    const [ planType, setPlanType ] = useState("roadmap") // "roadmap" (default) | "interview"
    const resumeInputRef = useRef()

    const navigate = useNavigate()

    // Load past reports in the background — does NOT block the form
    useEffect(() => {
        getReports()
    }, [])

    // Show filename when user picks a file
    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedFile(file)
            setFormError("")
        }
    }

    // Handle drag-and-drop onto the dropzone
    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        e.currentTarget.classList.remove('dropzone--drag-over')
        const file = e.dataTransfer.files[0]
        if (!file) return
        // Only accept PDF
        if (file.type !== 'application/pdf') {
            setFormError("Only PDF files are supported.")
            return
        }
        // Sync the dropped file into the input ref so the submit handler can read it
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)
        resumeInputRef.current.files = dataTransfer.files
        setSelectedFile(file)
        setFormError("")
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        e.currentTarget.classList.add('dropzone--drag-over')
    }

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('dropzone--drag-over')
    }

    const handleGenerateReport = async () => {
        // Validate: need at least a resume or self-description
        if (!selectedFile && !selfDescription.trim()) {
            setFormError("Please upload a resume (PDF) or provide an experience summary.")
            return
        }
        if (!jobDescription.trim()) {
            setFormError("Job description is required.")
            return
        }
        setFormError("")
        setIsGenerating(true)

        const resumeFile = selectedFile || null
        const data = await generateReport({ jobDescription, selfDescription, resumeFile, planType })
        setIsGenerating(false)
        if (data) navigate(`/interview/${data._id}`)
    }

    if (isGenerating) {
        return (
            <main className='loading-screen'>
                <h1>{planType === 'roadmap' ? 'Analyzing Skills & Generating Career Roadmap...' : 'Generating Interview Preparation Plan...'}</h1>
            </main>
        )
    }

    return (
        <div className='home-page'>

            {/* Top Navigation Bar */}
            <div className='home-top-bar'>
                <div className='user-badge'>
                    <span className='user-dot'></span>
                    <span className='user-name'>{user?.username || user?.email || 'Active'}</span>
                </div>
                <button onClick={handleLogout} className='logout-btn' title='Sign out'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Sign Out
                </button>
            </div>

            {/* Page Header */}
            <header className='page-header'>
                <h1>
                    {planType === 'roadmap' ? (
                        <>Career <span className='highlight'>Roadmap</span></>
                    ) : (
                        <>Interview <span className='highlight'>Plan</span></>
                    )}
                </h1>
                <p>
                    {planType === 'roadmap'
                        ? 'Skill gap analysis and personalized preparation roadmap.'
                        : 'Targeted interview questions, model answers, and preparation plan.'}
                </p>
            </header>

            {/* Plan Mode Selector */}
            <div className='mode-selector'>
                <button
                    type='button'
                    className={`mode-btn ${planType === 'roadmap' ? 'mode-btn--active' : ''}`}
                    onClick={() => setPlanType('roadmap')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/><polyline points="13 21 11 13 3 11"/></svg>
                    Skill Audit &amp; Career Roadmap
                </button>
                <button
                    type='button'
                    className={`mode-btn ${planType === 'interview' ? 'mode-btn--active' : ''}`}
                    onClick={() => setPlanType('interview')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                    Interview Preparation
                </button>
            </div>

            {/* Main Card */}
            <div className='interview-card'>
                <div className='interview-card__body'>

                    {/* Left Panel - Job Description */}
                    <div className='panel panel--left'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                            </span>
                            <h2>Job Description</h2>
                            <span className='badge badge--required'>Required</span>
                        </div>
                        <textarea
                            onChange={(e) => { setJobDescription(e.target.value) }}
                            className='panel__textarea'
                            placeholder="Paste the target job description, responsibilities, and required qualifications..."
                            maxLength={5000}
                        />
                        <div className='char-counter'>{jobDescription.length} / 5000</div>
                    </div>

                    {/* Vertical Divider */}
                    <div className='panel-divider' />

                    {/* Right Panel - Profile */}
                    <div className='panel panel--right'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </span>
                            <h2>Candidate Profile</h2>
                        </div>

                        {/* Upload Resume */}
                        <div className='upload-section'>
                            <label className='section-label'>
                                Resume
                                <span className='badge badge--best'>Recommended</span>
                            </label>

                            {/* Dropzone */}
                            <label
                                className={`dropzone${selectedFile ? ' dropzone--selected' : ''}`}
                                htmlFor='resume'
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                            >
                                <span className='dropzone__icon'>
                                    {selectedFile
                                        ? <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                        : <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                    }
                                </span>
                                {selectedFile
                                    ? <p className='dropzone__title' style={{ color: '#89ceff' }}>✓ {selectedFile.name}</p>
                                    : <p className='dropzone__title'>Click to browse or drag &amp; drop</p>
                                }
                                <p className='dropzone__subtitle'>PDF (Max 3MB)</p>
                                <input
                                    ref={resumeInputRef}
                                    style={{ display: 'none' }}
                                    type='file'
                                    id='resume'
                                    name='resume'
                                    accept='.pdf,application/pdf'
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>

                        {/* OR Divider */}
                        <div className='or-divider'><span>OR</span></div>

                        {/* Quick Self-Description */}
                        <div className='self-description'>
                            <label className='section-label' htmlFor='selfDescription'>Experience Summary</label>
                            <textarea
                                onChange={(e) => { setSelfDescription(e.target.value) }}
                                id='selfDescription'
                                name='selfDescription'
                                className='panel__textarea panel__textarea--short'
                                placeholder="Summarize your technical background, core competencies, and years of experience..."
                            />
                        </div>

                        {/* Info Box */}
                        <div className='info-box'>
                            <span className='info-box__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                            </span>
                            <p>Provide either a <strong>Resume</strong> or an <strong>Experience Summary</strong> to proceed.</p>
                        </div>
                    </div>
                </div>

                {/* Card Footer */}
                <div className='interview-card__footer'>
                    <div>
                        {formError && <p style={{ color: '#ffb4ab', marginBottom: '0.5rem', fontSize: '0.82rem', fontFamily: 'JetBrains Mono' }}>{formError}</p>}
                        <span className='footer-info'>
                            {planType === 'roadmap' ? 'Deep Analysis: Skill Matrix & Roadmap' : 'Speed Prep: Targeted Q&A & Sprint'} &bull; ~30s
                        </span>
                    </div>
                    <button
                        onClick={handleGenerateReport}
                        className='generate-btn'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
                        {planType === 'roadmap' ? 'Generate Career Roadmap' : 'Generate Interview Plan'}
                    </button>
                </div>
            </div>

            {/* Recent Reports List */}
            {(reports?.length > 0) && (
                <section className='recent-reports'>
                    <h2>Recent Strategy Plans</h2>
                    <ul className='reports-list'>
                        {reports.map(report => (
                            <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                <div className='report-item__top'>
                                    <h3>{report.title || 'Untitled Analysis'}</h3>
                                    <span className={`plan-badge ${report.planType === 'roadmap' ? 'badge--roadmap' : 'badge--interview'}`}>
                                        {report.planType === 'roadmap' ? 'Roadmap' : 'Interview'}
                                    </span>
                                </div>
                                <p className='report-meta'>{new Date(report.createdAt).toLocaleDateString()}</p>
                                <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match: {report.matchScore}%</p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Page Footer */}
            <footer className='page-footer'>
                <a href='#'>Privacy Policy</a>
                <a href='#'>Terms of Service</a>
                <a href='#'>Help Center</a>
            </footer>
        </div>
    )
}

export default Home
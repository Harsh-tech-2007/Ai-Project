import React, { useState, useEffect } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/use.interview'
import { useNavigate, useParams } from 'react-router'


// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [ open, setOpen ] = useState(false)
    return (
        <div className='q-card'>
            <div className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__index'>Q{index + 1}</span>
                <p className='q-card__question'>{item.question}</p>
                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>Interviewer Intent</span>
                        <p>{item.intention}</p>
                    </div>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>Model Response</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__header'>
            <span className='roadmap-day__badge'>Day {day.day}</span>
            <h3 className='roadmap-day__focus'>{day.focus}</h3>
        </div>
        <ul className='roadmap-day__tasks'>
            {day.tasks.map((task, i) => (
                <li key={i}>
                    <span className='roadmap-day__bullet' />
                    {task}
                </li>
            ))}
        </ul>
    </div>
)

// Career Phase Card for deep multi-week roadmaps
const CareerPhaseCard = ({ phase, index }) => (
    <div className='career-phase-card'>
        <div className='career-phase-card__header'>
            <div className='career-phase-card__meta'>
                <span className='career-phase-card__badge'>Phase {index + 1}</span>
                <span className='career-phase-card__duration'>{phase.duration}</span>
            </div>
            <h3 className='career-phase-card__title'>{phase.phase}</h3>
            <p className='career-phase-card__objective'>{phase.objective}</p>
        </div>

        {phase.topics?.length > 0 && (
            <div className='career-phase-card__topics'>
                <h4>Key Topics &amp; Competencies</h4>
                <div className='topics-list'>
                    {phase.topics.map((t, idx) => (
                        <span key={idx} className='topic-tag'>{t}</span>
                    ))}
                </div>
            </div>
        )}

        {phase.projectToBuild?.title && (
            <div className='career-phase-card__project'>
                <div className='project-badge'>Portfolio Project</div>
                <h4>{phase.projectToBuild.title}</h4>
                <p>{phase.projectToBuild.description}</p>
                {phase.projectToBuild.techStack?.length > 0 && (
                    <div className='tech-stack-list'>
                        {phase.projectToBuild.techStack.map((tech, idx) => (
                            <span key={idx} className='tech-tag'>{tech}</span>
                        ))}
                    </div>
                )}
            </div>
        )}
    </div>
)

// Skill Gap Matrix Item
const SkillMatrixItem = ({ item }) => (
    <div className='skill-matrix-card'>
        <div className='skill-matrix-card__top'>
            <h3 className='skill-matrix-card__name'>{item.skill}</h3>
            <span className={`importance-badge importance--${item.importance?.toLowerCase() || 'high'}`}>
                {item.importance || 'High'} Priority
            </span>
        </div>

        <div className='skill-matrix-card__levels'>
            <div className='level-box'>
                <span className='level-label'>Current Estimated Level</span>
                <span className='level-value current'>{item.currentLevel || 'Beginner'}</span>
            </div>
            <div className='level-arrow'>&rarr;</div>
            <div className='level-box'>
                <span className='level-label'>Target Required Level</span>
                <span className='level-value target'>{item.targetLevel || 'Proficient'}</span>
            </div>
        </div>

        {item.gapDescription && (
            <p className='skill-matrix-card__desc'>{item.gapDescription}</p>
        )}
    </div>
)


// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const { report, getReportById, loading } = useInterview()
    const { interviewId } = useParams()
    const navigate = useNavigate()

    const isRoadmapMode = report?.planType === 'roadmap' || Boolean(report?.careerRoadmap?.length)
    const [ activeNav, setActiveNav ] = useState(isRoadmapMode ? 'roadmap' : 'technical')

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [ interviewId ])

    useEffect(() => {
        if (report) {
            setActiveNav(report.planType === 'roadmap' ? 'roadmap' : 'technical')
        }
    }, [ report?._id ])


    if (loading || !report) {
        return (
            <main className='loading-screen'>
                <h1>Loading Analysis...</h1>
            </main>
        )
    }

    const scoreColor =
        report.matchScore >= 80 ? 'score--high' :
            report.matchScore >= 60 ? 'score--mid' : 'score--low'

    // Define navigation tabs dynamically based on planType
    const navItems = isRoadmapMode ? [
        { id: 'roadmap', label: 'Career Roadmap', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/><polyline points="13 21 11 13 3 11"/></svg>) },
        { id: 'skills', label: 'Skill Gap Matrix', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>) },
        { id: 'technical', label: 'Technical Q&A', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
        { id: 'behavioral', label: 'Behavioral Q&A', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    ] : [
        { id: 'technical', label: 'Technical Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
        { id: 'behavioral', label: 'Behavioral Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
        { id: 'roadmap', label: 'Preparation Roadmap', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
    ]

    return (
        <div className='interview-page'>
            <div className='interview-layout'>

                {/* ── Left Nav ── */}
                <nav className='interview-nav'>
                    <div className="nav-content">
                        <button
                            className='interview-nav__home-btn'
                            onClick={() => navigate('/')}
                            title='Back to Dashboard'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                            Dashboard
                        </button>

                        <div className='analysis-badge-container'>
                            <span className={`analysis-type-tag ${isRoadmapMode ? 'tag--roadmap' : 'tag--interview'}`}>
                                {isRoadmapMode ? 'Skill & Career Roadmap' : 'Interview Plan'}
                            </span>
                        </div>

                        <p className='interview-nav__label'>Sections</p>
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className='interview-nav__icon'>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => alert("Profile export feature is coming soon.")}
                        className='button primary-button' >
                        <svg height={"0.8rem"} style={{ marginRight: "0.8rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
                        Export Profile
                    </button>
                </nav>

                <div className='interview-divider' />

                {/* ── Center Content ── */}
                <main className='interview-content'>

                    {/* Roadmap Tab (renders careerRoadmap if available, otherwise preparationPlan) */}
                    {activeNav === 'roadmap' && (
                        <section>
                            <div className='content-header'>
                                <h2>{isRoadmapMode ? 'Career Transition Roadmap' : 'Preparation Roadmap'}</h2>
                                <span className='content-header__count'>
                                    {isRoadmapMode ? `${report.careerRoadmap?.length || 0} Phases` : `${report.preparationPlan?.length || 0} Days`}
                                </span>
                            </div>

                            {isRoadmapMode && report.careerRoadmap?.length > 0 ? (
                                <div className='career-phases-list'>
                                    {report.careerRoadmap.map((phase, i) => (
                                        <CareerPhaseCard key={i} phase={phase} index={i} />
                                    ))}
                                </div>
                            ) : (
                                <div className='roadmap-list'>
                                    {report.preparationPlan?.map((day) => (
                                        <RoadMapDay key={day.day} day={day} />
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {/* Skill Gap Matrix Tab */}
                    {activeNav === 'skills' && (
                        <section>
                            <div className='content-header'>
                                <h2>Skill Gap &amp; Competency Matrix</h2>
                                <span className='content-header__count'>{report.skillAnalysis?.length || 0} Skills Analyzed</span>
                            </div>
                            <div className='skills-matrix-list'>
                                {report.skillAnalysis?.map((item, i) => (
                                    <SkillMatrixItem key={i} item={item} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Technical Questions */}
                    {activeNav === 'technical' && (
                        <section>
                            <div className='content-header'>
                                <h2>Technical Assessment</h2>
                                <span className='content-header__count'>{report.technicalQuestions?.length || 0} Questions</span>
                            </div>
                            <div className='q-list'>
                                {report.technicalQuestions?.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Behavioral Questions */}
                    {activeNav === 'behavioral' && (
                        <section>
                            <div className='content-header'>
                                <h2>Behavioral Assessment</h2>
                                <span className='content-header__count'>{report.behavioralQuestions?.length || 0} Questions</span>
                            </div>
                            <div className='q-list'>
                                {report.behavioralQuestions?.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                <div className='interview-divider' />

                {/* ── Right Sidebar ── */}
                <aside className='interview-sidebar'>

                    {/* Alignment Score */}
                    <div className='match-score'>
                        <p className='match-score__label'>Role Alignment</p>
                        <div className={`match-score__ring ${scoreColor}`}>
                            <span className='match-score__value'>{report.matchScore}</span>
                            <span className='match-score__pct'>%</span>
                        </div>
                        <p className='match-score__sub'>
                            {report.matchScore >= 80 ? 'High alignment with role requirements' :
                             report.matchScore >= 60 ? 'Moderate alignment — address identified gaps' :
                             'Foundational alignment — targeted preparation recommended'}
                        </p>
                    </div>

                    <div className='sidebar-divider' />

                    {/* Skill Gaps Summary */}
                    <div className='skill-gaps'>
                        <p className='skill-gaps__label'>Key Gaps Identified</p>
                        <div className='skill-gaps__list'>
                            {report.skillGaps?.map((gap, i) => (
                                <span key={i} className={`skill-tag skill-tag--${gap.severity}`}>
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>

                </aside>
            </div>
        </div>
    )
}

export default Interview
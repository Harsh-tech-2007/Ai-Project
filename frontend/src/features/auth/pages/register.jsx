import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import '../auth.form.scss';
import { useAuth } from '../hooks/use.auth';

const Register = () => {
    const navigate = useNavigate()
    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ showPassword, setShowPassword ] = useState(false)
    const [ error, setError ] = useState("")
    const [ isSubmitting, setIsSubmitting ] = useState(false)

    const { loading, handleRegister } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setIsSubmitting(true)
        try {
            await handleRegister({ username, email, password })
            navigate("/")
        } catch (err) {
            const message = err?.response?.data?.message || "Registration failed. Please check your details and try again."
            setError(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <main className='auth-page'>
                <div className='loading-screen'>
                    <h1>Initializing workspace...</h1>
                </div>
            </main>
        )
    }

    return (
        <main className='auth-page'>
            <div className="form-container">
                <div className="auth-header">
                    <div className="auth-badge">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                    </div>
                    <h1>Create Account</h1>
                </div>

                {error && (
                    <div className="auth-error">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="input-group">
                        <label htmlFor="username">Full Name / Username</label>
                        <div className="input-wrapper">
                            <span className="input-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            </span>
                            <input
                                onChange={(e) => { setUsername(e.target.value) }}
                                value={username}
                                type="text"
                                id="username"
                                name='username'
                                placeholder="johndoe"
                                autoComplete="name"
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-wrapper">
                            <span className="input-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                            </span>
                            <input
                                onChange={(e) => { setEmail(e.target.value) }}
                                value={email}
                                type="email"
                                id="email"
                                name='email'
                                placeholder="name@company.com"
                                autoComplete="email"
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <span className="input-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            </span>
                            <input
                                onChange={(e) => { setPassword(e.target.value) }}
                                value={password}
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name='password'
                                placeholder="••••••••"
                                autoComplete="new-password"
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password-btn"
                                onClick={() => setShowPassword(s => !s)}
                                title={showPassword ? "Hide password" : "Show password"}
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className='auth-submit-btn' disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <span className="btn-spinner" />
                                Creating account...
                            </>
                        ) : (
                            <>
                                Create Account
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                            </>
                        )}
                    </button>
                </form>

                <p className="auth-switch">
                    Already registered? <Link to={"/login"}>Sign in</Link>
                </p>
            </div>
        </main>
    )
}

export default Register;
import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import '../auth.form.scss';
import { useAuth } from '../hooks/use.auth';

const Login = () => {

    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ error, setError ] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        try {
            await handleLogin({ email, password })
            navigate('/')
        } catch (err) {
            const message = err?.response?.data?.message || "Invalid credentials. Please verify your details."
            setError(message)
        }
    }

    if (loading) {
        return (
            <main className='auth-page'>
                <div className='loading-screen'>
                    <h1>Authenticating...</h1>
                </div>
            </main>
        )
    }

    return (
        <main className='auth-page'>
            <div className="form-container">
                <div className="auth-header">
                    <div className="auth-badge">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </div>
                    <h1>Sign In</h1>
                    <p>Enter your credentials to access your workspace</p>
                </div>

                {error && (
                    <div className="auth-error">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email"
                            id="email"
                            name='email'
                            placeholder="name@company.com"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password"
                            id="password"
                            name='password'
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button type="submit" className='auth-submit-btn'>
                        Sign In
                    </button>
                </form>

                <p className="auth-switch">
                    New user? <Link to={"/register"}>Create an account</Link>
                </p>
            </div>
        </main>
    )
}

export default Login;
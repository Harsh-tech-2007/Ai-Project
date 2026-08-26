import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/auth.api";


export const AuthContext = createContext()


export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Run getMe() ONCE here in the provider, not inside the hook.
    // Previously the useEffect was inside useAuth() — meaning every component
    // that called useAuth() (Login, Register, Protected) would fire its own
    // getMe() call, causing race conditions and loading flicker.
    useEffect(() => {
        const init = async () => {
            try {
                const data = await getMe()
                if (data) setUser(data.user)
            } catch {
                // Not logged in — expected, ignore
            } finally {
                setLoading(false)
            }
        }
        init()
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    )
}
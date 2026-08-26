import axios from "axios"


const api = axios.create({
    baseURL: "http://localhost:4000", 
    withCredentials: true
})

export async function register({ username, email, password }) {

    try {
        const response = await api.post('/api/auth/register', {
            username, email, password
        })

        return response.data

    } catch (err) {
        console.error(err) // add
        throw err          // add - re-throw so callers can handle the error
    }

}

export async function login({ email, password }) {

    try {

        const response = await api.post("/api/auth/login", {
            email, password
        })

        return response.data

    } catch (err) {
        console.error(err) // add
        throw err          // add
    }

}

export async function logout() {
    try {

        const response = await api.post("/api/auth/logout") // add - changed GET to POST

        return response.data

    } catch (err) {
        console.error(err) // add
        throw err          // add
    }
}

export async function getMe() {

    try {

        const response = await api.get("/api/auth/get-me")

        return response.data

    } catch (err) {
        // 401 = not logged in, this is expected — return null silently
        return null
    }

}
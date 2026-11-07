import { createContext, useContext, useEffect, useState } from "react";
import { auth, getUserRole } from '#/services/firebase'
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext({})

export function AuthProvider({ children }){
    const [currentUser, setCurrentUser] = useState(null)
    const [role, setRole] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async(user) => {
            if(user){
                setCurrentUser(user)
                try {
                    const userRole = await getUserRole(user.uid)
                    setRole(userRole)
                } catch (error) {
                    console.error("Error when searching the user's role:", error)
                    setRole("client")
                }
            } else {
                setCurrentUser(null)
                setRole(null)
            }
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    return(
        <AuthContext.Provider value={{currentUser, role, loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
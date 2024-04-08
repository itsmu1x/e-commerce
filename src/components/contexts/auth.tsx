"use client"
import { createContext, useContext } from "react"

const AuthContext = createContext<User>(undefined)

type ProviderProps = {
    children: React.ReactNode
    initialUser: User
}

export const useAuth = () => useContext(AuthContext)!
export function AuthProvider({ children, initialUser }: ProviderProps) {
    return (
        <AuthContext.Provider value={initialUser}>
            {children}
        </AuthContext.Provider>
    )
}

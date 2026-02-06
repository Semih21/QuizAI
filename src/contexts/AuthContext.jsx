import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchProfile(session.user.id)
            } else {
                setLoading(false)
            }
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user ?? null)
                if (session?.user) {
                    // Immediately set a fallback profile from auth metadata
                    setProfile({
                        id: session.user.id,
                        email: session.user.email,
                        full_name: session.user.user_metadata?.full_name || 'User',
                        role: session.user.user_metadata?.role || 'student',
                        plan: 'free'
                    })
                    setLoading(false)
                    // Then try to fetch actual profile in background
                    fetchProfile(session.user.id)
                } else {
                    setProfile(null)
                    setLoading(false)
                }
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const fetchProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()

            if (error) {
                // If no profile found, create a fallback from user metadata
                console.warn('Profile not found, using auth metadata')
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    setProfile({
                        id: user.id,
                        email: user.email,
                        full_name: user.user_metadata?.full_name || 'User',
                        role: user.user_metadata?.role || 'student',
                        plan: 'free'
                    })
                }
            } else {
                setProfile(data)
            }
        } catch (error) {
            console.error('Error fetching profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const signUp = async ({ email, password, fullName, role }) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: role
                }
            }
        })

        // Create profile record if signup successful (non-blocking)
        if (!error && data.user) {
            supabase
                .from('profiles')
                .upsert({
                    id: data.user.id,
                    email: email,
                    full_name: fullName,
                    role: role,
                    plan: 'free'
                }, { onConflict: 'id' })
                .then(({ error: profileError }) => {
                    if (profileError) {
                        console.warn('Profile creation skipped:', profileError.message)
                    } else {
                        fetchProfile(data.user.id)
                    }
                })
        }

        return { data, error }
    }

    const signIn = async ({ email, password }) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        return { data, error }
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (!error) {
            setUser(null)
            setProfile(null)
        }
        return { error }
    }

    const value = {
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        isStudent: profile?.role === 'student',
        isTeacher: profile?.role === 'teacher'
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

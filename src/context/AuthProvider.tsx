import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../supabaseClient";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<any>;
    signOut: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: () => Promise.resolve(),
    signOut: () => Promise.resolve(),
});

export const useAuth = () => useContext(AuthContext);

const login = (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password });

const signOut = () => supabase.auth.signOut();

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setUser(session?.user ?? null);
            } catch (error) {
                console.error("Error fetching session:", error);
            } finally {
                setLoading(false); // Remove the timeout
            }
        };

        fetchSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            // Handle initial session and sign in events
            if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
                setUser(session?.user ?? null);
            } else if (event === "SIGNED_OUT") {
                setUser(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from "@/hooks/useStorageStore";

type SessionData = {
    accessToken: string;
    refreshToken: string;
    expires: number;
};

const AuthContext = createContext<{
    signIn: (sessionData: SessionData) => void;
    signOut: () => void;
    session: SessionData | null;
    isLoading: boolean;
}>({
    signIn: () => null,
    signOut: () => null,
    session: null,
    isLoading: false,
});

export function useSession() {
    const value = useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }

    return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
    const [[isLoading, session], setSession] = useStorageState<SessionData | null>('session');

    return (
        <AuthContext.Provider
            value={{
                signIn: (sessionData: SessionData) => {
                    setSession(sessionData);
                },
                signOut: () => {
                    setSession(null);
                },
                session,
                isLoading,
            }}>
            {children}
        </AuthContext.Provider>
    );
}
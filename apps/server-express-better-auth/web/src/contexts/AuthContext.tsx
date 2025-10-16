import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: string;
    name: string;
    email?: string;
    emailVerified: boolean;
    createdAt: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (params: {
        name: string;
        email: string;
        password: string;
        image?: string;
        callbackURL?: string;
        rememberMe?: boolean;
    }) => Promise<void>;
    loginWithSocial: (provider: 'github' | 'google') => Promise<void>;
    logout: () => Promise<void>;
    checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const checkSession = async () => {
        try {
            const response = await fetch('/api/auth/get-session', {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.user) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Session check failed:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username: string, password: string) => {
        const response = await fetch('/api/auth/sign-in/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: username, password }),
            credentials: 'include'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        const data = await response.json();
        setUser(data.user);
    };

    const register = async (params: {
        name: string;
        email: string;
        password: string;
        image?: string;
        callbackURL?: string;
        rememberMe?: boolean;
    }) => {
        const response = await fetch('/api/auth/sign-up/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: params.name,
                email: params.email,
                password: params.password,
                image: params.image ?? '',
                callbackURL: params.callbackURL ?? '',
                rememberMe: params.rememberMe ?? true
            }),
            credentials: 'include'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }

        const data = await response.json();
        setUser(data.user);
    };

    const loginWithSocial = async (provider: 'github' | 'google') => {
        try {
            const callbackURL = `${window.location.origin}/home`;
            const response = await fetch('/api/auth/sign-in/social', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    provider,
                    callbackURL,
                })
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `${provider} login failed`);
            }
            const data = await response.json();
            if (data.redirect) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Social login init failed:', error);
            throw new Error('社交登录初始化失败');
        }
    };

    const logout = async () => {
        await fetch('/api/auth/sign-out', {
            method: 'POST',
            credentials: 'include'
        });
        setUser(null);
    };

    useEffect(() => {
        checkSession();
    }, []);

    const value = {
        user,
        loading,
        login,
        register,
        loginWithSocial,
        logout,
        checkSession
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

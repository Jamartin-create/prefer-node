import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: string;
    name: string;
    email?: string;
    emailVerified: boolean;
    createdAt: string;
}

interface LinkedAccount {
    id: string;
    providerId: 'github' | 'google' | string;
    createdAt: string;
    updatedAt: string;
    accountId: string;
    scopes: string[]
}

interface LoginHistory {
    id: string;
    userId: string;
    userAgent?: string;
    ipAddress?: string;
    city?: string;
    country?: string;
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
    linkAccount: (provider: 'github' | 'google') => Promise<void>;
    unlinkAccount: (provider: 'github' | 'google') => Promise<void>;
    getLinkedAccounts: () => Promise<LinkedAccount[]>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
    updateUser: (data: { name?: string; email?: string; image?: string }) => Promise<void>;
    getLoginHistory: () => Promise<LoginHistory[]>;
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
                if (data && data.user) {
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

    const getLinkedAccounts = async (): Promise<LinkedAccount[]> => {
        try {
            const res = await fetch('/api/auth/list-accounts', { credentials: 'include' });
            if (!res.ok) {
                throw new Error('获取绑定账号失败');
            }
            const data = await res.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Get linked accounts failed:', error);
            throw error instanceof Error ? error : new Error('获取绑定账号失败');
        }
    };

    const linkAccount = async (provider: 'github' | 'google') => {
        try {
            const response = await fetch('/api/auth/link-social', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    provider,
                    callbackURL: `${window.location.origin}/account-linking`
                })
            });
            if (response.ok) {
                const data = await response.json();
                if (data.redirect) {
                    window.location.href = data.url;
                }
                return;
            }
            let msg = '绑定账号失败';
            try {
                const err = await response.json();
                msg = err.message || msg;
            } catch {}
            throw new Error(msg);
        } catch (error) {
            console.error('Link account init failed:', error);
            throw new Error('账号绑定初始化失败');
        }
    };

    const unlinkAccount = async (providerId: 'github' | 'google') => {
        const res = await fetch('/api/auth/unlink-account', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ providerId }),
            credentials: 'include'
        });
        if (!res.ok) {
            let msg = '解绑账号失败';
            try {
                const err = await res.json();
                msg = err.message || msg;
            } catch {}
            throw new Error(msg);
        }
    };

    const changePassword = async (currentPassword: string, newPassword: string) => {
        const response = await fetch('/api/auth/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                currentPassword,
                newPassword,
                revokeOtherSessions: true
            }),
            credentials: 'include'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || '修改密码失败');
        }
    };

    const updateUser = async (data: { name?: string; email?: string; image?: string }) => {
        const response = await fetch('/api/auth/update-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'include'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || '更新用户信息失败');
        }

        const result = await response.json();
        if (result.user) {
            setUser(result.user);
        }
        await checkSession();
    };

    const getLoginHistory = async (): Promise<LoginHistory[]> => {
        try {
            const response = await fetch('/api/auth/get-login-history', {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('获取登录历史失败');
            }

            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Get login history failed:', error);
            throw error instanceof Error ? error : new Error('获取登录历史失败');
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
        linkAccount,
        unlinkAccount,
        getLinkedAccounts,
        changePassword,
        updateUser,
        getLoginHistory,
        logout,
        checkSession
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

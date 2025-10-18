// userAuth.tsx

import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { useUserContext } from '@contexts/UserContext';
// import { fetchWithAuth } from '@/MyLib/UtilsAPIUser';
import { apiFetch, setAccessToken } from '@/MyLib/apiFetch'
import { parse } from 'path';

interface AuthCredentials {
    email: string;
    password: string;
}

interface AuthResponse {
    user?: {
        user_id: number | string;
        user_name?: string;
        is_paid_user?: boolean;
        exp?: number | string;
        iat?: number | string;
    };
    access_token?: string;
    token_type?: string;
    detail?: string; // Possibly an error message
}

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || '';
const sessionURL = `${backendURL}/api/user/session`;
const logoutURL = `${backendURL}/api/user/logout`;
const signupURL = `${backendURL}/api/user/signup`;
const signinURL = `${backendURL}/api/user/signin`;

export default function useAuth() {
    const { setUserData } = useUserContext();
    const router = useRouter();

    /**
     * handleAuthResponse
     *
     * Common helper to:
     *   - Parse JSON,
     *   - Throw error on non-OK status,
     *   - Store access token (if any),
     *   - Update our React user context with returned user data.
     */
    const handleAuthResponse = useCallback(
        async (
            raw: Response | AuthResponse,
            defaultErrorMsg: string,
        ): Promise<AuthResponse> => {
            let data: AuthResponse;

            if (raw instanceof Response) {
                data = await raw.json();
                if (!raw.ok) {
                    throw new Error(data.detail || defaultErrorMsg);
                }
            } else {
                data = raw;
            }

            if (data.access_token) {
                setAccessToken(data.access_token); // ★ localStorage を使わない
            }

            if (data.user) {
                const { user } = data;
                setUserData({
                    userID: String(user.user_id),
                    userName: user.user_name ?? '',
                    loginStatus: true,
                    subscriptionStatus: !!user.is_paid_user,
                    expToken: user.exp ? String(user.exp) : '',
                    iatToken: user.iat ? String(user.iat) : '',
                });
            }

            return data;
        },
        [setUserData],
    );

    /**
     * signUp
     */
    const signUp = useCallback(
        async (credentials: AuthCredentials) => {
            try {
                const resp = await apiFetch(signupURL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: credentials.email,
                        password: credentials.password,
                    }),
                }, { parseJson: true, });

                await handleAuthResponse(resp, 'SignUp error');
                router.push('/');
            } catch (error) {
                console.error('SignUp error:', error);
                throw error;
            }
        },
        [handleAuthResponse, router]
    );

    /**
     * signIn
     */
    const signIn = useCallback(
        async (credentials: AuthCredentials) => {
            try {
                const resp = await apiFetch(signinURL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(credentials),
                }, { parseJson: true });

                await handleAuthResponse(resp, 'SignIn error');
                router.push('/');
            } catch (error) {
                console.error('SignIn error:', error);
                throw error;
            }
        },
        [handleAuthResponse, router]
    );

    /**
     * refreshUserSession
     *
     * We use the same handleAuthResponse to parse, but
     * we don't redirect if it fails—just catch the error.
     */
    const refreshUserSession = useCallback(async () => {
        try {
            const resp = await apiFetch(sessionURL, {
                method: 'GET',
            }, { parseJson: true });
            await handleAuthResponse(resp, 'Failed to get current user session.');
            // No redirect on error; we just console.error
        } catch (error) {
            // Optionally, you can handle logout if 401 occurs, etc.
        }
    }, [handleAuthResponse]);

    /**
     * signOut
     */
    const signOut = useCallback(async () => {
        try {
            const resp = await apiFetch(logoutURL, { method: 'POST' }, { parseJson: true });
            if (!(resp as Response).ok) {
                console.error('Sign out failed:', (resp as Response).statusText);
            }
        } catch (error) {
            console.error('Error signing out:', error);
        }

        // メモリ上のアクセストークンを破棄
        setAccessToken(null);

        // Reset context
        setUserData({
            userID: '',
            userName: '',
            loginStatus: false,
            subscriptionStatus: false,
            expToken: '',
            iatToken: '',
        });

        // Redirect to sign in
        router.push('/account/signin');
    }, [router, setUserData]);

    // Return your methods
    return {
        signUp,
        signIn,
        signOut,
        refreshUserSession,
    };
}

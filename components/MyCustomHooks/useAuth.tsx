// components/MyCustomHook/useAuth.tsx:
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useUserContext } from '@contexts/UserContext';

interface User {
    user_id: number;
    user_name?: string;
    is_paid_user?: boolean;
    exp?: number;
    iat?: number;
}
const backendURL = process.env.FASTAPI_URL + '/api/users/session'
const useAuth = () => {
    const router = useRouter();
    const { setUserData } = useUserContext();

    const fetchUser = async () => {
        try {
            const response = await axios.get(backendURL, { withCredentials: true });
            if (response.data && response.data.user) {
                const user = response.data.user;
                localStorage.setItem('userID', user.user_id.toString());
                localStorage.setItem('userName', user.user_name ? user.user_name : '')
                localStorage.setItem('loginStatus', 'true')
                localStorage.setItem('subscriptionStatus', user.is_paid_user ? 'true' : 'false')
                if (user.exp !== undefined) {
                    localStorage.setItem('expToken', user.exp.toString());
                }
                if (user.iat !== undefined) {
                    localStorage.setItem('iatToken', user.iat.toString());
                }

                setUserData({
                    userID: user.user_id.toString(),
                    userName: user.user_name ? user.user_name : '',
                    loginStatus: true,
                    subscriptionStatus: user.is_paid_user ? true : false,
                    expToken: user.exp ? user.exp.toString() : '',
                    iatToken: user.iat ? user.iat.toString() : '',
                });

                router.push('/');

            } else {
                throw new Error('User not authenticated');
            }
        } catch (error) {

            console.error('Error fetching user:', error);
        }
    };
    useEffect(() => {
        fetchUser();
    }, []);

    const refreshUserSession = async () => {
        await fetchUser();
    };

    // const signOut = useCallback((setUserData: any) => {
    const signOut = useCallback(() => {
        // Add logic to send a request to your backend to destroy the session/cookie



        // After that, update the user state on the client side.
        localStorage.removeItem('userID');
        localStorage.removeItem('userName');
        localStorage.removeItem('loginStatus');
        localStorage.removeItem('subscriptionStatus');
        localStorage.removeItem('expToken');
        localStorage.removeItem('iatToken');
        setUserData({
            userID: '',
            userName: '',
            loginStatus: false,
            subscriptionStatus: false,
            expToken: '',
            iatToken: '',
        });

        router.push('/account/signin');
    }, [router]);

    return { signOut, refreshUserSession };
};

export default useAuth;
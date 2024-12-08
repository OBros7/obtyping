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
const backendURL = process.env.FASTAPI_URL
const useAuth = () => {
    const router = useRouter();
    const { userData, setUserData } = useUserContext();

    const fetchUser = async () => {
        try {
            const response = await axios.get(backendURL + 'users/session', { withCredentials: true });
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
                console.log('User fetched:', user);

            } else {
                throw new Error('User not authenticated');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };
    useEffect(() => {
        if (userData.loginStatus === true) {
            fetchUser();
        }
    }, []);

    const refreshUserSession = async () => {
        await fetchUser();
    };

    // const signOut = useCallback((setUserData: any) => {
    const signOut = useCallback(async () => {
        console.log('Signing out...');
        console.log('BACKEND_API_KEY', process.env.BACKEND_API_KEY);
        try {
            const response = await fetch(backendURL + 'users/logout', {
                method: 'POST',
                credentials: 'include', // ここを追加
                headers: {
                    ...(process.env.BACKEND_API_KEY && { 'X-API-Key': process.env.BACKEND_API_KEY }),
                },
            });
            if (response.ok) {
                // Here, you can clear the stored access token or perform any other cleanup tasks
                // After that, update the user state on the client side.
                // ログアウト成功時の処理
                localStorage.clear(); // 一括削除
                // localStorage.removeItem('userID');
                // localStorage.removeItem('userName');
                // localStorage.removeItem('loginStatus');
                // localStorage.removeItem('subscriptionStatus');
                // localStorage.removeItem('expToken');
                // localStorage.removeItem('iatToken');
                setUserData({
                    userID: '',
                    userName: '',
                    loginStatus: false,
                    subscriptionStatus: false,
                    expToken: '',
                    iatToken: '',
                });
                console.log('Sign out successful');
                router.push('/account/signin');
            } else {
                console.error('Sign out failed:', response.statusText);
                // localStorage.removeItem('userID');
                // localStorage.removeItem('userName');
                // localStorage.removeItem('loginStatus');
                // localStorage.removeItem('subscriptionStatus');
                // localStorage.removeItem('expToken');
                // localStorage.removeItem('iatToken');
                // setUserData({
                //     userID: '',
                //     userName: '',
                //     loginStatus: false,
                //     subscriptionStatus: false,
                //     expToken: '',
                //     iatToken: '',
                // });
            }
        } catch (error) {
            console.error('Error signing out:', error);
        }

    }, [router]);

    return { signOut, refreshUserSession };
};

export default useAuth;
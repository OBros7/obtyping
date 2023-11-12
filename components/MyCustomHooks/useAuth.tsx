import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

interface User {
    user_id: number;
    user_name?: string;
    is_paid_user?: boolean;
    exp?: number;
    iat?: number;
}
const backendURL = process.env.FASTAPI_URL + '/api/users/session'
const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [signedOut, setSignedOut] = useState(true);
    const router = useRouter();

    const fetchUser = async () => {
        try {
            console.log('fetchUser....');
            const response = await axios.get(backendURL, { withCredentials: true });
            console.log('response', response);
            if (response.data && response.data.user) {
                setUser(response.data.user);
                setSignedOut(false);
                router.push('/');

            } else {
                throw new Error('User not authenticated');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            setUser(null);
            setSignedOut(true);
        }
    };
    useEffect(() => {
        fetchUser();
    }, []);

    const refreshUserSession = async () => {
        await fetchUser();
    };

    const signOut = useCallback(() => {
        // Add logic to send a request to your backend to destroy the session/cookie
        // After that, update the user state on the client side.
        setUser(null);
        setSignedOut(true);
        router.push('/account/signin');
    }, [router]);

    return { user, signOut, signedOut, setSignedOut, setUser, refreshUserSession };
};

export default useAuth;
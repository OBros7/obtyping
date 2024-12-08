import { useState, useEffect } from 'react';

const FASTAPI_URL = process.env.FASTAPI_URL;
const BACKEND_API_KEY = process.env.BACKEND_API_KEY || ''

const useAuth = () => {
    const [userData, setUserData] = useState({ loginStatus: false });

    useEffect(() => {
        const fetchUserSession = async () => {
            try {
                const response = await fetch(FASTAPI_URL + 'users/session');
                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('userData', JSON.stringify(data.user));
                    setUserData(data.user);
                } else {
                    setUserData({ loginStatus: false });
                }
            } catch (error) {
                console.error('Error fetching user session:', error);
                setUserData({ loginStatus: false });
            }
        };

        fetchUserSession();
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            const response = await fetch(FASTAPI_URL + 'users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            if (response.ok) {
                const data = await response.json();
                // Here, you can handle the response data as needed, such as storing the access token in localStorage
                console.log('Sign in successful:', data);
                setUserData(data.user);
            } else {
                console.error('Sign in failed:', response.statusText);
                setUserData({ loginStatus: false });
            }
        } catch (error) {
            console.error('Error signing in:', error);
            setUserData({ loginStatus: false });
        }
    };

    const signOut = async () => {
        console.log('Signing out...(*LocalStrage*)');
        try {
            const response = await fetch(FASTAPI_URL + 'users/logout', {
                method: 'POST',
            });
            if (response.ok) {
                // Here, you can clear the stored access token or perform any other cleanup tasks
                setUserData({ loginStatus: false });
                console.log('Sign out successful');
            } else {
                console.error('Sign out failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return { userData, signIn, signOut };
};

export default useAuth;

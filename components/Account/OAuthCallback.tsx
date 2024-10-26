// OAuthCallback.tsx
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import useAuth from '@/MyCustomHooks/useAuth';
import { useUserContext } from '@contexts/UserContext';


const OAuthCallback = () => {
    const router = useRouter();
    const { provider } = router.query;
    const { refreshUserSession } = useAuth();
    const { userData, setUserData } = useUserContext();

    useEffect(() => {
        if (provider) {
            // If signed out, redirect to signin page. Otherwise, redirect to the home page or a dashboard.
            refreshUserSession();
            console.log('userData.loginStatus:', userData.loginStatus);
            console.log('userData.:', userData)
            if (userData.loginStatus === false) {
                router.push('/account/signin');
            } else {
                router.push('/');
            }
        }
    }, [provider, router, userData.loginStatus]);

    return (
        <div>
            <p>Processing {provider} login...</p>
        </div>
    );
};

export default OAuthCallback;
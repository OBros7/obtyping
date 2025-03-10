// --- obtyping/components/Account/OAuthCallback.tsx ---
import React, { useEffect } from 'react';
import useAuth from '@/MyCustomHooks/useAuth';

const OAuthCallback = () => {
    const { refreshUserSession } = useAuth();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const cookies = document.cookie.split(';');
            const tokenCookie = cookies.find(c => c.trim().startsWith('access_token='));
            if (tokenCookie) {
                const localAccessToken = tokenCookie.split('=')[1];
                console.log('Local access token stored in localStorage');
                document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
                (async () => {
                    try {
                        await refreshUserSession();
                        window.location.href = '/'; // or router.push('/')
                    } catch (err) {
                        console.log('Google OAuth callback error:', err);
                    }
                })();
            } else {
                console.log('No local access token found in cookies');
            }
        }

    }, [refreshUserSession]);

    return (
        <div>
            <p>Processing Google OAuth...</p>
        </div>
    );
};

export default OAuthCallback;

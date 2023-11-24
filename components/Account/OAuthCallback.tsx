// OAuthCallback.tsx
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import useAuth from '@/MyCustomHooks/useAuth';

const OAuthCallback = () => {
    const router = useRouter();
    const { provider } = router.query;
    const { signedOut } = useAuth();

    useEffect(() => {
        if (provider) {
            // If signed out, redirect to signin page. Otherwise, redirect to the home page or a dashboard.
            if (signedOut) {
                router.push('/account/signin');
            } else {
                router.push('/');
            }
        }
    }, [provider, router, signedOut]);

    return (
        <div>
            <p>Processing {provider} login...</p>
        </div>
    );
};

export default OAuthCallback;

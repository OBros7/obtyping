import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import jwt_decode from 'jwt-decode';
import useAuth from '@/MyCustomHooks/useAuth';

const OAuthCallback = () => {
    const router = useRouter();
    const { provider } = router.query;
    const { setSignedOut } = useAuth();

    const getAccessTokenFromCookie = () => {
        if (!provider) return;
        console.log('document.cookie: ', document.cookie)
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith(`access_token=`))
            ?.split('=')[1];

        console.log('provider: ', provider);
        console.log('token: ', token);

        if (token) {
            const decodedToken = jwt_decode(token);

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(decodedToken));

            setSignedOut(false);
            router.push('/');
        } else {
            setTimeout(getAccessTokenFromCookie, 5000);
        }
    };

    useEffect(() => {
        if (provider) {
            getAccessTokenFromCookie();
        }
    }, [router, provider, setSignedOut]);

    return (
        <div>
            <p>Processing {provider} login...</p>
        </div>
    );
};

export default OAuthCallback;

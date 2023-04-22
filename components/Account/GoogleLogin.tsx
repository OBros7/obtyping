import React, { useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import jwt_decode from 'jwt-decode';

const url = process.env.FASTAPI_URL + '/api/users/oauth_google';

const LoginWithGoogle = () => {
    const router = useRouter();
    const { access_token } = router.query;

    useEffect(() => {
        const handleCallback = async () => {
            if (access_token) {
                const token = Array.isArray(access_token) ? access_token[0] : access_token;
                const decodedToken = jwt_decode(token);

                console.log('decoded token: ', decodedToken);

                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(decodedToken));

                router.push('/');
            }
        };

        handleCallback();
    }, [access_token, router]);

    const handleLogin = async () => {
        try {
            const res = await axios.get(url);
            window.location.href = res.data.auth_url;
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <button onClick={handleLogin}>
            Login with Google
        </button>
    );
};

export default LoginWithGoogle;

import React, { useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import jwt_decode from 'jwt-decode';

const url = process.env.FASTAPI_URL + '/api/users/oauth_google';
const urlCallback = process.env.FASTAPI_URL + '/api/users/oauth_google_callback';

const LoginWithGoogle = () => {
    const router = useRouter();
    const { code } = router.query;

    useEffect(() => {
        const handleCallback = async () => {
            if (code) {
                try {
                    const response = await axios.get(urlCallback, {
                        params: { code },
                    });

                    const token = response.data.access_token;
                    const decodedToken = jwt_decode(token);

                    console.log(decodedToken);  // You can inspect the token contents here

                    // Save the token and user data to your desired state management or storage (e.g., Redux, Context API, localStorage)
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(decodedToken));

                    router.push('/'); // Redirect to the home page
                } catch (err) {
                    console.error(err);
                }
            }
        };

        handleCallback();
    }, [code, router]);

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

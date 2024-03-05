import React, { useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import jwt_decode from 'jwt-decode';
import Image from 'next/image';

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
        <div className='flex flex-col justify-center items-center'>
            <div className='mr-2 my-6'>Click here to log in with Google</div>
            <button onClick={handleLogin} className='flex items-center my-12 border-4  bg-white text-black p-2 rounded shadow-sm hover:bg-gray-100'>
                <Image src='/images/googleIcon.png' alt='Google' width={20} height={20} />
                <span className='ml-2'>Login with Google</span>
            </button>
        </div>
    );
};

export default LoginWithGoogle;

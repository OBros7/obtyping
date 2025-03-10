import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const GAUTH_URL = `${BACKEND_URL}/api/user/google-oauth`;

const LoginWithGoogle = () => {
    const router = useRouter();

    const handleGoogleLogin = () => {
        window.location.href = GAUTH_URL;
    };

    return (
        <div className='flex flex-col justify-center items-center'>
            <div className='mr-2 my-6'>Click here to log in with Google</div>
            <button onClick={handleGoogleLogin} className='flex items-center my-12 border-4  bg-white text-black p-2 rounded shadow-sm hover:bg-gray-100'>
                <Image src='/images/googleIcon.png' alt='Google' width={20} height={20} />
                <span className='ml-2'>Login with Google</span>
            </button>
        </div>
    );
};

export default LoginWithGoogle;

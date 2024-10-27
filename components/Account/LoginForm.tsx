// components/Account/LoginForm.tsx
import { useState } from 'react';
import axios from 'axios';
import { MyEmailInput, MyPasswordInput } from '@/Basics';
import { useRouter } from 'next/router';
import jwt_decode from 'jwt-decode';

const url = process.env.FASTAPI_URL + 'users/login';


interface LoginFormProps {
    btnClass?: string;
}

const LoginForm = ({ btnClass = 'btn-second' }: LoginFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [serverError, setServerError] = useState('');
    const [msg, setMsg] = useState('');
    const router = useRouter();
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post(url, { email, password });
            const token = response.data.access_token;
            const decodedToken = jwt_decode(token);

            console.log(decodedToken);  // You can inspect the token contents here

            // // Save the token and user data to your desired state management or storage (e.g., Redux, Context API, localStorage)
            // localStorage.setItem('token', token);
            // localStorage.setItem('user', JSON.stringify(decodedToken));

            router.push('/'); // Redirect to the home page
        } catch (error) {
            if (
                error &&
                (error as any).response &&
                (error as any).response.status === 401 &&
                (error as any).response.data &&
                (error as any).response.data.detail
            ) {
                setMsg((error as any).response.data.detail);
            } else {
                setServerError((error as Error).message);
                setMsg((error as Error).message)
            }
            console.log(error);
        }
    };

    return (
        <div className="flex flex-col space-y-4">
            <form onSubmit={onSubmit} className="flex flex-col space-y-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <MyEmailInput state={email} setState={setEmail} inputClass="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <MyPasswordInput state={password} setState={setPassword} inputClass="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                </div>
                {msg && <p className="text-sm text-red-500">{msg}</p>}
                <button type="submit" className={`${btnClass} mt-2`}>Login</button>
            </form>
        </div>
    );
};

export default LoginForm;

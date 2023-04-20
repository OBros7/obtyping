import { useState } from 'react';
import axios from 'axios';
import { MyEmailInput, MyPasswordInput } from '@/Basics';
import { useRouter } from 'next/router';
import jwt_decode from 'jwt-decode';

const url = process.env.FASTAPI_URL + '/api/users/login';


interface LoginFormProps {
    btnClass?: string;
}

const LoginForm = ({ btnClass = 'btn-second' }: LoginFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [serverError, setServerError] = useState('');
    const [msg, setMsg] = useState('hoge');
    const router = useRouter();
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post(url, { email, password });
            const token = response.data.access_token;
            const decodedToken = jwt_decode(token);

            console.log(decodedToken);  // You can inspect the token contents here

            // Save the token and user data to your desired state management or storage (e.g., Redux, Context API, localStorage)
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(decodedToken));

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
        <div>
            <h1>Login</h1>
            <form onSubmit={onSubmit}>
                <p>Email: <MyEmailInput state={email} setState={setEmail} /></p>
                <p>Password: <MyPasswordInput state={password} setState={setPassword} /></p>
                <p>{msg}</p>
                <button type="submit" className={btnClass}>Login</button>
            </form>
        </div>
    );
};

export default LoginForm;

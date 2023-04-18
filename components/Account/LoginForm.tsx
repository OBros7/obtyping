import { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { MyEmailInput, MyPasswordInput } from '@/Basics';

const url = process.env.FASTAPI_URL + '/api/users/login';

interface LoginFormProps {
    btnClass?: string;
}

const LoginForm = ({ btnClass = 'btn-second' }: LoginFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [serverError, setServerError] = useState('');
    // const { loginWithRedirect } = useAuth0();
    const [msg, setMsg] = useState('hoge');

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.post(url, { email, password });
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

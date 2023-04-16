import { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { MyEmailInput, MyPasswordInput } from '@/Basics';


const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [serverError, setServerError] = useState('');
    const { loginWithRedirect } = useAuth0();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.post('/api/login', { email, password });
        } catch (error) {
            setServerError((error as Error).message);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={onSubmit}>
                <span>Email: </span><MyEmailInput state={email} setState={setEmail} />
                <span>Password: </span>     <MyPasswordInput state={password} setState={setPassword} />
                <button type="submit" className='btn-second'>Login</button>
            </form>
            {/* <button onClick={() => loginWithRedirect({})}>Log In with Google</button> */}
        </div>
    );
};

export default LoginForm;

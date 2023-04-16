
import { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { MyEmailInput, MyPasswordInput } from '@/Basics';


const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [serverError, setServerError] = useState('');
    const { loginWithRedirect } = useAuth0();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setServerError('Passwords do not match.');
            return;
        }
        try {
            await axios.post('/api/signup', { email, password });
        } catch (error) {
            setServerError((error as Error).message);
        }
    };

    return (
        <div>
            <h1>Sign Up</h1>
            <form onSubmit={onSubmit}>
                <span>Email: </span><MyEmailInput state={email} setState={setEmail} />
                <span>Password: </span><MyPasswordInput state={password} setState={setPassword} />
                <span>Confirm Password: </span><MyPasswordInput state={confirmPassword} setState={setConfirmPassword} />
                <button type="submit" className='btn-second'>Sign Up</button>
            </form>
            {/* <button onClick={() => loginWithRedirect({})}>Sign Up with Google</button> */}
        </div>
    );
};

export default RegisterForm;

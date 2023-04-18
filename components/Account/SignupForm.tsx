
import { useEffect, useState } from 'react';
import axios from 'axios';
import { MyEmailInput, MyPasswordInput } from '@/Basics';
import { set } from 'react-hook-form';

const url = process.env.FASTAPI_URL + '/api/users/signup';


const is_valid_email = (email: string): boolean => {
    const emailRegex: RegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
};
interface SignupFormProps {
    btnClass?: string;
}

const SignupForm = ({ btnClass = 'btn-second' }: SignupFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [serverError, setServerError] = useState('');
    const [msg, setMsg] = useState('');
    const [disabledSubmission, setDisabledSubmission] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    // const { loginWithRedirect } = useAuth0();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setServerError('Passwords do not match.');
            return;
        }
        try {
            await axios.post(url, { email, password });
            setIsEmailSent(true);
        } catch (error) {
            if (
                error &&
                (error as any).response &&
                (error as any).response.status === 400 &&
                (error as any).response.data &&
                (error as any).response.data.detail
            ) {
                setMsg((error as any).response.data.detail);
            } else {
                setServerError((error as Error).message);
            }
            console.log(error);
        }
    };

    useEffect(() => {
        if (isEmailSent) {
            setMsg('Please check your email to verify your account.')
            // setDisabledSubmission(true);
        }
        else if (is_valid_email(email) === false) {
            setMsg('Please enter valid email address.')
            setDisabledSubmission(true);
        }
        else if (password.length < 8) {
            setMsg('Password must be at least 8 characters long.')
            setDisabledSubmission(true);
        }
        else if (password !== confirmPassword) {
            setMsg('Passwords do not match.')
            setDisabledSubmission(true);
        }

        else {
            setMsg('')
            setDisabledSubmission(false);
        }
    }, [email, password, confirmPassword, isEmailSent]);


    return (
        <div>
            <h1>Sign Up</h1>
            <form onSubmit={onSubmit}>
                <p>Email: <MyEmailInput state={email} setState={setEmail} /></p>
                <p>Password: <MyPasswordInput state={password} setState={setPassword} /> </p>
                <p>Confirm Password: <MyPasswordInput state={confirmPassword} setState={setConfirmPassword} /></p>
                <p>{msg}</p>
                <button type="submit" className={btnClass} disabled={disabledSubmission}>Sign Up</button>
            </form>
            {/* <button onClick={() => loginWithRedirect({})}>Sign Up with Google</button> */}
        </div>
    );
};

export default SignupForm;

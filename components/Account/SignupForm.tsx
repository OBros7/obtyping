// --- obtyping/components/Account/SignupForm.tsx ---
import { useEffect, useState } from 'react';
import { MyEmailInput, MyPasswordInput } from '@/Basics';
import useAuth from '@/MyCustomHooks/useAuth';

const SignupForm = ({ btnClass = 'btn-second' }: { btnClass?: string }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [disabledSubmission, setDisabledSubmission] = useState(false);

    const { signUp } = useAuth();

    useEffect(() => {
        // Simple checks to show messages / disable submission
        if (!email.includes('@')) {
            setMsg('Please enter a valid email address.');
            setDisabledSubmission(true);
        } else if (password.length < 8) {
            setMsg('Password must be at least 8 characters long.');
            setDisabledSubmission(true);
        } else if (password !== confirmPassword) {
            setMsg('Passwords do not match.');
            setDisabledSubmission(true);
        } else {
            setMsg('');
            setDisabledSubmission(false);
        }
    }, [email, password, confirmPassword]);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (disabledSubmission) return;

        try {
            await signUp({ email, password });
            // signUp does the redirection for you.
        } catch (error: any) {
            setMsg(error.response?.data?.detail || 'Signup failed');
            console.error(error);
        }
    };

    return (
        <div>
            <form onSubmit={onSubmit} className="flex flex-col space-y-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <MyEmailInput
                        state={email}
                        setState={setEmail}
                        inputClass="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <MyPasswordInput
                        state={password}
                        setState={setPassword}
                        inputClass="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <MyPasswordInput
                        state={confirmPassword}
                        setState={setConfirmPassword}
                        inputClass="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </div>
                {msg && <p className="text-sm text-red-500">{msg}</p>}
                <button type="submit" className={`${btnClass} mt-2`} disabled={disabledSubmission}>
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default SignupForm;

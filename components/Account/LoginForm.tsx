// --- obtyping/components/Account/LoginForm.tsx ---
import { useState } from 'react';
import { MyEmailInput, MyPasswordInput } from '@/Basics';
import { useRouter } from 'next/router';
import useAuth from '@/MyCustomHooks/useAuth';

interface LoginFormProps {
    btnClass?: string;
}

const LoginForm = ({ btnClass = 'btn-second' }: LoginFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');

    const router = useRouter();
    const { signIn } = useAuth();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await signIn({ email, password });
        } catch (error: any) {
            setMsg(error.message || 'Login failed');
            console.error('Login error:', error);
        }
    };

    return (
        <div className="flex flex-col space-y-4">
            <form onSubmit={onSubmit} className="flex flex-col space-y-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <MyEmailInput
                        state={email}
                        setState={setEmail}
                        inputClass="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <MyPasswordInput
                        state={password}
                        setState={setPassword}
                        inputClass="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                {msg && <p className="text-sm text-red-500">{msg}</p>}
                <button type="submit" className={`${btnClass} mt-2`}>Login</button>
            </form>
        </div>
    );
};

export default LoginForm;

// --- obtyping/components/Account/LoginForm.tsx ---
import { useState } from 'react';
import { MyEmailInput, MyPasswordInput } from '@/Basics';
import useAuth from '@/MyCustomHooks/useAuth';

interface LoginFormProps {
    btnClass?: string;
}

const LoginForm = ({ btnClass = 'btn-second' }: LoginFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');

    const { signIn } = useAuth();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await signIn({ email, password });
            // signIn should handle redirects if needed
        } catch (error: any) {
            // Keep messages generic on login to avoid user enumeration
            const detail =
                error?.response?.data?.detail ||
                error?.message ||
                'Incorrect email or password.';
            setMsg(detail);
            console.error('Login error:', error);
        }
    };

    return (
        <div className="flex flex-col space-y-4">
            <form onSubmit={onSubmit} className="flex flex-col space-y-2" noValidate>
                <div>
                    <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <MyEmailInput
                        id="login-email"
                        name="email"
                        state={email}
                        setState={setEmail}
                        inputClass="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        autoComplete="email" // account identifier is an email
                    />
                </div>

                <div>
                    <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <MyPasswordInput
                        id="login-password"
                        name="password"
                        state={password}
                        setState={setPassword}
                        inputClass="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        autoCompleteMode="current-password"
                        // Don’t enforce min length on login (legacy accounts, etc.)
                        minLength={0}
                        maxLength={128}
                        describedById={msg ? 'login-error' : undefined}
                    />
                </div>

                {msg && (
                    <p id="login-error" className="text-sm text-red-500" aria-live="polite">
                        {msg}
                    </p>
                )}

                <button type="submit" className={`${btnClass} mt-2`}>Login</button>
            </form>
        </div>
    );
};

export default LoginForm;

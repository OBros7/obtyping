// --- obtyping/components/Account/SignupForm.tsx ---
import { useMemo, useState } from 'react';
import { MyEmailInput, MyPasswordInput } from '@/Basics';
import useAuth from '@/MyCustomHooks/useAuth';

const MIN_LEN = 8;
const MAX_LEN = 128;

function validate(email: string, password: string, confirm: string) {
    if (!email.trim()) return 'Please enter an email address.';
    const atIndex = email.indexOf('@');
    if (atIndex <= 0 || atIndex !== email.lastIndexOf('@') || atIndex === email.length - 1) {
        return 'Please enter a valid email address.';// only one @, not at start/end
    }
    if (password.length < MIN_LEN) return `Password must be at least ${MIN_LEN} characters.`;
    if (password.length > MAX_LEN) return `Password must not exceed ${MAX_LEN} characters.`;
    if (password !== confirm) return 'Passwords do not match.';
    return '';
}

const SignupForm = ({ btnClass = 'btn-second' }: { btnClass?: string }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [serverMsg, setServerMsg] = useState('');
    const { signUp } = useAuth();

    const msg = useMemo(
        () => validate(email, password, confirmPassword),
        [email, password, confirmPassword]
    );
    const disabledSubmission = Boolean(msg);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (disabledSubmission) return;
        try {
            await signUp({ email, password });
            // signUp handles redirects
        } catch (error: any) {
            setServerMsg(error?.response?.data?.detail || 'Signup failed. Please try again.');
            console.error(error); // ensure server never logs raw passwords
        }
    };

    return (
        <div>
            <form onSubmit={onSubmit} className="flex flex-col space-y-2" noValidate>
                <div>
                    <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <MyEmailInput
                        id="signup-email"
                        name="email"
                        state={email}
                        setState={setEmail}
                        inputClass="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        autoComplete="email"
                    />
                </div>

                <div>
                    <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <MyPasswordInput
                        id="signup-password"
                        name="password"
                        state={password}
                        setState={setPassword}
                        inputClass="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        autoCompleteMode="new-password"
                        minLength={MIN_LEN}
                        maxLength={MAX_LEN}
                        describedById="pw-help"
                    />
                    <p id="pw-help" className="text-xs text-gray-500 mt-1">
                        Use at least {MIN_LEN} characters. Passphrases are great (you can include spaces).
                    </p>
                </div>

                <div>
                    <label htmlFor="signup-password-confirm" className="block text-sm font-medium text-gray-700">
                        Confirm Password
                    </label>
                    <MyPasswordInput
                        id="signup-password-confirm"
                        name="passwordConfirm"
                        state={confirmPassword}
                        setState={setConfirmPassword}
                        inputClass="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        autoCompleteMode="new-password"
                        minLength={MIN_LEN}
                        maxLength={MAX_LEN}
                    />
                </div>

                {(msg || serverMsg) && (
                    <p className="text-sm text-red-500" aria-live="polite">
                        {msg || serverMsg}
                    </p>
                )}

                <button type="submit" className={`${btnClass} mt-2`} disabled={disabledSubmission}>
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default SignupForm;

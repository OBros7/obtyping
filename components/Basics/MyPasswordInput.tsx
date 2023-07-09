import React from 'react';

interface MyPasswordInputProps {
    state: string;
    setState: React.Dispatch<React.SetStateAction<any>>;
    inputClass?: string;
}

const defaultClass = 'password-input';

export default function MyPasswordInput({
    state,
    setState,
    inputClass = defaultClass,
}: MyPasswordInputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState(e.target.value);
    };

    return (
        <input
            type="password"
            className={inputClass}
            value={state}
            onChange={handleChange}
            required
        />
    );
}

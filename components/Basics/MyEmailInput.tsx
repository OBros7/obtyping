import React from 'react';

interface MyEmailInputProps {
    state: string;
    setState: React.Dispatch<React.SetStateAction<any>>;
    inputClass?: string;
}

const defaultClass = 'email-input';

export default function MyEmailInput({
    state,
    setState,
    inputClass = defaultClass,
}: MyEmailInputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState(e.target.value);
    };

    return (
        <input
            type="email"
            className={inputClass}
            value={state}
            onChange={handleChange}
            required
        />
    );
}

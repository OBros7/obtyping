import React, { forwardRef } from 'react';
import type { InputHTMLAttributes, Dispatch, SetStateAction } from 'react';

interface MyEmailInputProps extends InputHTMLAttributes<HTMLInputElement> {
    state: string;
    setState: Dispatch<SetStateAction<string>>;
    inputClass?: string;
    id?: string;
    name?: string;
    describedById?: string;
}

const defaultClass = 'email-input';

const MyEmailInput = forwardRef<HTMLInputElement, MyEmailInputProps>(
    (
        {
            state,
            setState,
            inputClass = defaultClass,
            id = 'email',
            name = 'email',
            describedById,
            autoComplete = 'email',
            ...rest
        },
        ref
    ) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setState(e.target.value);
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            // Trim accidental whitespace only
            const trimmed = e.target.value.trim();
            if (trimmed !== state) setState(trimmed);
            rest.onBlur?.(e);
        };

        return (
            <input
                ref={ref}
                id={id}
                name={name}
                type="email"
                className={inputClass}
                value={state}
                onChange={handleChange}
                onBlur={handleBlur}
                inputMode="email"
                autoComplete={autoComplete}
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                aria-describedby={describedById}
                required
                {...rest}
            />
        );
    }
);

MyEmailInput.displayName = 'MyEmailInput';
export default MyEmailInput;

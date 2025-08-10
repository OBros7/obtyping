import React, { forwardRef } from 'react';

interface MyEmailInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    state: string;
    setState: React.Dispatch<React.SetStateAction<string>>;
    inputClass?: string;
    id?: string;           // so <label htmlFor> can target it
    name?: string;         // so the form posts the field
    describedById?: string; // connect to error/help text for a11y
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
            autoComplete = 'email', // or 'username' if you prefer
            ...rest
        },
        ref
    ) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setState(e.target.value);
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            // Trim accidental leading/trailing whitespace only
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

export default MyEmailInput;

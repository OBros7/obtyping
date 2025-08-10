import React, { useState, forwardRef } from 'react';

type AutocompleteMode = 'new-password' | 'current-password';

interface MyPasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    state: string;
    setState: React.Dispatch<React.SetStateAction<string>>;
    inputClass?: string;
    id?: string;
    name?: string;
    describedById?: string;         // hook this to helper/error text
    autoCompleteMode?: AutocompleteMode; // default: 'new-password'
    showToggle?: boolean;           // default: true
    minLength?: number;             // default: 12 (passphrases encouraged)
    maxLength?: number;             // default: 128
}

const defaultClass = 'password-input';

const MyPasswordInput = forwardRef<HTMLInputElement, MyPasswordInputProps>(
    (
        {
            state,
            setState,
            inputClass = defaultClass,
            id = 'password',
            name = 'password',
            describedById,
            autoCompleteMode = 'new-password',
            showToggle = true,
            minLength = 12,
            maxLength = 128,
            ...rest
        },
        ref
    ) => {
        const [revealed, setRevealed] = useState(false);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            // Allow spaces & Unicode; don’t trim here (users might want leading spaces)
            setState(e.target.value);
        };

        return (
            <div className="relative">
                <input
                    ref={ref}
                    id={id}
                    name={name}
                    type={revealed ? 'text' : 'password'}
                    className={inputClass}
                    value={state}
                    onChange={handleChange}
                    autoComplete={autoCompleteMode}
                    // keep password managers happy; and mobile keyboards neutral
                    inputMode="text"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    aria-describedby={describedById}
                    minLength={minLength}
                    maxLength={maxLength}
                    required
                    {...rest}
                />

                {showToggle && (
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-sm px-2 py-1 rounded"
                        aria-label={revealed ? 'Hide password' : 'Show password'}
                        aria-pressed={revealed}
                        onClick={() => setRevealed(v => !v)}
                    >
                        {revealed ? 'Hide' : 'Show'}
                    </button>
                )}
            </div>
        );
    }
);

export default MyPasswordInput;

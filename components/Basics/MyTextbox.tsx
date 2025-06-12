import React from 'react'

interface MyTextboxProps {
    state: string
    setState: React.Dispatch<React.SetStateAction<any>>
    textboxClass?: string
}

const defaultClass = 'text-box ml-2'

export default function MyTextbox({
    state,
    setState,
    textboxClass = defaultClass,
}: MyTextboxProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState(e.target.value)
    }
    return (
        <input type="text" className={textboxClass} value={state} onChange={handleChange} />
    )
}

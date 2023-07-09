import React from 'react'

interface MyTextareaProps {
    state: string
    setState: React.Dispatch<React.SetStateAction<any>>
    textareaClass?: string
}

const defaultClass = 'text-box'

export default function MyTextbox({
    state,
    setState,
    textareaClass = defaultClass,
}: MyTextareaProps) {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setState(e.target.value)
    }
    return (
        <textarea className={textareaClass} value={state} onChange={handleChange} />
    )
}

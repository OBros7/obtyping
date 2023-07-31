import React from 'react'
import { useRouter } from 'next/router'
import { Typing } from '@/Typing'

// http://localhost:3000/typing/typing?deckid=123&minutes=10

export default function Typing() {
    const router = useRouter()
    const { query } = router
    const deckId = query.deckid
    const minutes = query.minutes

    return (
        <div>
            <p>Typing</p>
            <Typing deckId={deckId} minutes={minutes} />
            <p>{deckId}</p>
            <p>{minutes}</p>
        </div>
    )
}

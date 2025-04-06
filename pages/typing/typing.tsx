import React from 'react'
import { useRouter } from 'next/router'
import { Typing } from '@/Typing'

// <url>/typing/typing?deckid=123&minutes=10

export default function TypingPage() {
    const router = useRouter()
    const { query } = router

    let deckId: number | null = null
    let minutes: number | null = null

    if (typeof query.deckid === 'string') {
        deckId = parseInt(query.deckid, 10)
    }

    if (typeof query.minutes === 'string') {
        minutes = parseInt(query.minutes, 10)
    }

    if (Number.isNaN(deckId) || Number.isNaN(minutes)) {
        return (
            <div>
                <p>Error: Both deckId and minutes must be integers.</p>
            </div>
        )
    }

    return (
        <div>
            {deckId && minutes && <Typing deckId={deckId} minutes={minutes} />}
        </div>
    )
}

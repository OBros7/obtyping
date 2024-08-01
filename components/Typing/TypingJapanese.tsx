import React from 'react'
import Keyboard from './Keyboard'
import Fingers from './Fingers';
import { ReceivedText } from '@/MyLib/UtilsAPITyping'

interface TypingJapaneseProps {
    textList: ReceivedText[]
    setStatus: React.Dispatch<React.SetStateAction<'waiting' | 'ready' | 'setting' | 'running' | 'result'>>
    score: number
    setScore: React.Dispatch<React.SetStateAction<number>>
    mistake: number
    setMistake: React.Dispatch<React.SetStateAction<number>>
    languageType?: 'english' | 'japanese' | 'free'
    mode?: '1m' | '2m' | '3m' | '5m'
    remainingTime?: number
}

const getEndOfLineIndex = (str: string, startIndex: number, charsPerLine: number): number => {
    let potentialEndIndex = startIndex + charsPerLine;

    // If the potential end index is beyond the string length, just return it.
    if (potentialEndIndex >= str.length) {
        return potentialEndIndex;
    }

    // Move the potential end index back until we find a space or we've moved back 10 characters.
    // This prevents the break in the middle of a word.
    let searchLimit = 10; // Number of characters to look backward to find a space.
    while (str[potentialEndIndex] !== " " && searchLimit > 0) {
        potentialEndIndex--;
        searchLimit--;
    }

    // If we didn't find a space within the search limit, just split at the original end index.
    if (searchLimit === 0) {
        potentialEndIndex = startIndex + charsPerLine;
    }

    return potentialEndIndex;
};

export default function TypingJapanese() {
    return (
        <div>

        </div>
    )
}

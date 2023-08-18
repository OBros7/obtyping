import React, { useState } from 'react'
import Keyboard from './Keyboard'
import Fingers from './Fingers';

export default function TypingEnglish() {
  const [nextKey, setNextKey] = useState<string | null>(null);

  return (
    <>
      {/* typing component */}
      <Keyboard nextKey={nextKey} />
      <div className="container flex flex-col justify-end">
        <Fingers nextKey={nextKey} />
      </div>
    </>
  )
}

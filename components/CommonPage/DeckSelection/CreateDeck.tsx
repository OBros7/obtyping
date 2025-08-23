// 不必要かも

import React, { useEffect, useState } from 'react'
import langDict from './langDict'
import { useTranslation } from '@/MyCustomHooks'
import { ReceivedDeck } from '@/MyLib/UtilsAPITyping'

interface CreateDeckProps {
  deckList: ReceivedDeck[]
  setDeckList: React.Dispatch<React.SetStateAction<ReceivedDeck[]>>
  deckName: string
  setDeckName: React.Dispatch<React.SetStateAction<string>>
}
const saveButtonClass = 'btn-second '


export default function CreateDeck({ deckList, setDeckList, deckName, setDeckName }: CreateDeckProps) {
  const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]
  const [deckDescription, setDeckDescription] = useState('')
  const [newDeckName, setNewDeckName] = useState('')

  return (
    <>
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <p>{translater.newDeckName}</p>
          <input
            type="text"
            value={newDeckName}
            onChange={(e) => setNewDeckName(e.target.value)}
            className="input-text border-2 border-black rounded-md w-80"
            placeholder={translater.enterNewDeckName}
          />
        </div>

        <div className="flex items-center justify-center space-x-2">
          <p>{translater.deckDescription}</p>
          <input
            type="text"
            value={deckDescription}
            onChange={(e) => setDeckDescription(e.target.value)}
            className="input-text border-2 border-black rounded-md w-80"
            placeholder={translater.enterDeckDescription}
          />
        </div>

        <div className="flex items-center justify-center space-x-2">
          <p>{translater.category}</p>
          <select value="sample" className='border rounded-md border-blue-300'>
            <option value="sample">sample</option>
          </select>

          <p>{translater.subcategory}</p>
          <select value="sample" className='border rounded-md border-blue-300'>
            <option value="sample">sample</option>
          </select>
        </div>

        <div className="flex items-center justify-center space-x-2">
          <p>{translater.level}</p>
          <select value="sample" className='border rounded-md border-blue-300'>
            <option value="sample">sample</option>
          </select>
        </div>

        <div className="flex flex-col items-center justify-center space-y-2">
          <button
            disabled={!newDeckName || !deckDescription}
            className={`${saveButtonClass} ${!newDeckName || !deckDescription ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => alert('保存しました')}
          >
            {translater.save}
          </button>
        </div>



      </div>
    </>
  )
}
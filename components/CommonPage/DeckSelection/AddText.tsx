import React, { useEffect, useState } from 'react'
import { Layout, MainContainer } from '@/Layout'
import langDict from './langDict'
import { useTranslation } from '@/MyCustomHooks'
import { MySelect } from '@/Basics'
import {
  DeckListButton,


} from './'
import {
  ReceivedDeck,
  getDeckListByUser,
} from '@/MyLib/UtilsAPITyping'

interface AddTextProps {
  deckList: ReceivedDeck[]
  setDeckList: React.Dispatch<React.SetStateAction<ReceivedDeck[]>>
  deckName: string
  setDeckName: React.Dispatch<React.SetStateAction<string>>
}
const saveButtonClass = 'btn-second '


export default function AddText({ deckList, setDeckList, deckName, setDeckName }: AddTextProps) {
  const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]
  const [text, setText] = useState('')
  const [textTitle, setTextTitle] = useState('')
  const [description, setDescription] = useState('')


  return (
    <>
      {deckList.length !== 0 ?
        <>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <p>{translater.deckToAddTo}</p>
              <select value="sample" className='border rounded-md border-blue-300'>
                <option value="sample">sample</option>
              </select>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <p>{translater.textTitle}</p>
              <input
                type="text"
                value={textTitle}
                onChange={(e) => setTextTitle(e.target.value)}
                className="input-text border-2 border-black rounded-md w-80"
                placeholder={translater.enterTextTitle}
              />
            </div>

            <div className="flex items-center justify-center space-x-2">
              <p>{translater.textDescription}</p>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-text border-2 border-black rounded-md w-96"
                placeholder={translater.enterTextDescription}
              />
            </div>

            <div className="flex flex-col items-center justify-center bg-blue-100 border-2 border-blue-200 rounded p-4 my-4">
              <div className='items-center pb-2'>{translater.descriptionTextArea}</div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-48 border-2 border-black "
              />
            </div>

            <div className="flex flex-col items-center justify-center space-y-2">
              <button
                disabled={!textTitle || !text}
                className={`${saveButtonClass} ${!textTitle || !text ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => alert(translater.saveComplete)}
              >
                {translater.save}
              </button>
            </div>
          </div>
        </>
        : <p> {translater.deckNothing} </p>
      }


    </>
  )
}
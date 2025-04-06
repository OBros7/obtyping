import React, { useEffect, useState } from 'react'
import { Layout, MainContainer } from '@/Layout'
import langDict from './langDict'
import { useTranslation } from '@/MyCustomHooks'
import { visibility2int, lang2int } from '@/MyLib/Mapper'

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

const urlListGetDeck = [
  'get_decklist_by_user',
  'get_decklist_basic',
  'get_decklist_selective',
  'get_decklist_private',
  'get_decklist_by_category',
  'get_decklist_by_search'
]
const urlListGetText = [
  // 'get_textlist_basic',
  // 'get_textlist_selective',
  // 'get_textlist_private',
  'get_textlist_by_deck',
  // 'get_textlist_by_decklist',
  // 'get_textlist_by_category',
  // 'get_textlist_by_search',
]


const saveButtonClass = 'btn-second '
const visibilityOptions = Object.keys(visibility2int)
const langOptions = Object.keys(lang2int)


export default function AddText({ deckList, setDeckList, deckName, setDeckName }: AddTextProps) {
  const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]
  const [text, setText] = useState('')
  const [textTitle, setTextTitle] = useState('')
  // const [description, setDescription] = useState('')
  const [selectedDeckId, setSelectedDeckId] = useState('');
  /////////// Common ///////////
  const [lang1, setLang1] = useState(langOptions[0])
  const [lang2, setLang2] = useState(langOptions[-1])
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [level, setLevel] = useState('')
  const [userID, setUserID] = useState(1)
  const [url, setUrl] = useState(urlListGetText[0])
  /////////// Getter ///////////
  const [nSelect, setNSelect] = useState(10)
  const [orderBy, setOrderBy] = useState('random')
  /////////// Setter ///////////
  const [title, setTitle] = useState('')
  const [visibility, setVisibility] = useState(visibilityOptions[0])
  /////////// Deck Setter ///////////
  const [description, setDescription] = useState('')
  const [returnedData, setReturnedData] = useState<[{ [key: string]: any }]>([{}]);

  return (
    <>
      {deckList.length !== 0 ?
        <>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <p>{translater.deckToAddTo}</p>
              {/* <DeckGetter
                url={fastAPIURL + url}
                userID={userID}
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                lang1={lang1}
                setLang1={setLang1}
                lang2={lang2}
                setLang2={setLang2}
                category={category}
                setCategory={setCategory}
                subcategory={subcategory}
                setSubcategory={setSubcategory}
                level={level}
                setLevel={setLevel}
                nSelect={nSelect}
                setNSelect={setNSelect}
                setReturnedData={setReturnedData}
                orderBy={orderBy}
              /> */}
              <select
                value={selectedDeckId} // 選択されたデッキIDをvalueにバインド
                onChange={(e) => setSelectedDeckId(e.target.value)} // 選択されたデッキIDを更新
                className="border rounded-md border-blue-300"
              >
                {deckList.map((deck) => (
                  <option key={deck.deck_id} value={deck.deck_id}>
                    {deck.title}
                  </option>
                ))}
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
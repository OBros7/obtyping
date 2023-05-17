import React, { useEffect, useState } from 'react'
import { TextGetter, TextSetter, DeckGetter, DeckSetter } from '@/Admin'
import { Layout, MainContainer } from '@/Layout';
import { MyInputNumber, MySelect } from '@/Basics'
import { visibility2int, lang2int } from '@/MyLib/Mapper'

const dataTypeList = ['text', 'deck']
const minibox = 'flex flex-row  justify-center items-center'

const visibilityOptions = Object.keys(visibility2int)
const langOptions = Object.keys(lang2int)
const getTypeList = [
    'get_textlist/basic',
    'get_textlist/selective',
    'get_textlist/private',
    'get_textlist_by_category',
    'get_textlist_by_deck',
    'get_textlist_by_level'
]

const urlListGetDeck = [
    'get_decklist/basic',
    'get_decklist/selective',
    'get_decklist/private',
    'get_decklist_by_category',
    'get_decklist_by_level',
]

const urlListGetText = [
    'get_textlist/basic',
    'get_textlist/selective',
    'get_textlist/private',
    'get_textlist_by_category',
    'get_textlist_by_deck',
    'get_textlist_by_level'
]

const urlListCreateDeck = [
    'create_deck',
]

const urlListCreateText = [
    'create_text',
]



export default function TypingData() {
    /////////// Meta Infomation ///////////
    const [isGetter, setIsGetter] = useState(false)
    const [dataType, setDataType] = useState('text')
    const [userID, setUserID] = useState(1)
    const [url, setUrl] = useState(urlListGetText[0])
    const [urlList, setUrlList] = useState(urlListGetText)

    /////////// Common ///////////
    const [lang1, setLang1] = useState(langOptions[0])
    const [lang2, setLang2] = useState(langOptions[-1])
    const [category, setCategory] = useState('')
    const [subcategory, setSubcategory] = useState('')
    const [level, setLevel] = useState('')

    /////////// Getter ///////////
    const [nSelect, setNSelect] = useState(10)

    /////////// Setter ///////////
    const [title, setTitle] = useState('')

    /////////// Text Setter ///////////
    const [text1, setText1] = useState('')
    const [text2, setText2] = useState('')
    const [deck, setDeck] = useState('')

    /////////// Deck Setter ///////////
    const [description, setDescription] = useState('')
    const [typingData, setTypingData] = useState<{ [key: string]: any }>({});
    const [getType, setGetType] = useState(getTypeList[0])



    useEffect(() => {
        if (dataType === 'text') {
            setUrlList(isGetter ? urlListGetText : urlListCreateText)
        } else {
            setUrlList(isGetter ? urlListGetDeck : urlListCreateDeck)
        }
    }, [dataType, isGetter])

    return (
        <Layout>
            <MainContainer>
                <div className='flex flex-col items-center'>
                    <MySelect
                        state={isGetter}
                        setState={setIsGetter}
                        optionValues={[true, false]}
                        optionTexts={['Get', 'Create']}
                    />
                    <MySelect
                        state={dataType}
                        setState={setDataType}
                        optionValues={dataTypeList}
                    />
                    <div className={minibox}>
                        User ID:
                        <MyInputNumber
                            state={userID}
                            setState={setUserID}
                            min={1}
                            max={100}
                            step={1}
                            defaultState={1}
                        />
                    </div>
                    <div className={minibox}>
                        URL:
                        <MySelect
                            state={url}
                            setState={setUrl}
                            optionValues={urlList}
                        />
                    </div>
                    {isGetter ?
                        dataType === 'text' ?
                            <TextGetter
                                title={title}
                                setTitle={setTitle}
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
                            />
                            :
                            <DeckGetter
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
                            /> :
                        dataType === 'text' ?
                            <TextSetter
                                title={title}
                                setTitle={setTitle}
                                text1={text1}
                                setText1={setText1}
                                text2={text2}
                                setText2={setText2}
                                category={category}
                                setCategory={setCategory}
                                subcategory={subcategory}
                                setSubcategory={setSubcategory}
                                level={level}
                                setLevel={setLevel}
                                deck={deck}
                                setDeck={setDeck}
                            />
                            :
                            <DeckSetter
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
                            />}

                </div>

            </MainContainer>
        </Layout>
    )
}

import React, { useEffect, useState } from 'react'
import { TextGetter, TextSetter, DeckGetter, DeckSetter } from '@/Admin'
import { Layout, MainContainer } from '@/Layout';
import { MyInputNumber, MySelect } from '@/Basics'
import { visibility2int, lang2int } from '@/MyLib/Mapper'

const fastAPIURL = process.env.FASTAPI_URL + '/api/typing/'
const dataTypeList = ['text', 'deck']
const minibox = 'flex flex-row  justify-center items-center'

const visibilityOptions = Object.keys(visibility2int)
const langOptions = Object.keys(lang2int)



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

const urlListCreateDeck = [
    'create_deck',
]

const urlListCreateText = [
    'create_text',
]

const orderByList = [
    'random',
    'title',
    'like',
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
    const [orderBy, setOrderBy] = useState('random')

    /////////// Setter ///////////
    const [title, setTitle] = useState('')
    const [visibility, setVisibility] = useState(visibilityOptions[0])

    /////////// Text Setter ///////////
    const [text1, setText1] = useState('')
    const [text2, setText2] = useState('')
    const [deck, setDeck] = useState('')

    /////////// Deck Setter ///////////
    const [description, setDescription] = useState('')
    const [returnedData, setReturnedData] = useState<[{ [key: string]: any }]>([{}]);

    const clearClick = () => {
        setReturnedData([{}])
    }


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
                    <div className={minibox}>
                        Visibility:
                        <MySelect
                            state={visibility}
                            setState={setVisibility}
                            optionValues={visibilityOptions}
                        />
                    </div>

                    {isGetter ? (
                        <>
                            <div className={minibox}>
                                OrderBy:
                                <MySelect
                                    state={orderBy}
                                    setState={setOrderBy}
                                    optionValues={orderByList}
                                />
                            </div>

                            {dataType === 'text' ? (
                                <TextGetter
                                    userID={userID}
                                    url={fastAPIURL + url}
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
                                />
                            ) : (
                                <DeckGetter
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
                                />
                            )}
                        </>
                    ) : dataType === 'text' ? (
                        <TextSetter
                            userID={userID}
                            visibilityInt={visibility2int[visibility]}
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
                    ) : (
                        <DeckSetter
                            userID={userID}
                            visibilityInt={visibility2int[visibility]}
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
                        />
                    )}

                    {/* <div className='flex flex-col items-center'>
                        <button onClick={clearClick} className='btn-second'>Clear</button>
                        {Array.isArray(returnedData) ?
                            returnedData.map((data, i) => {
                                return (
                                    <div key={i}>
                                        <pre>{JSON.stringify(data, null, 2)}</pre>
                                    </div>
                                );
                            }) :
                            'detail' in (returnedData as object) ?
                                <div>Error: {(returnedData as any).detail}</div> :
                                'loc' in (returnedData as object) && 'msg' in (returnedData as object) && 'type' in (returnedData as object) ?
                                    <div>Error: {`${(returnedData as any).loc}, ${(returnedData as any).msg}, ${(returnedData as any).type}`}</div> :
                                    typeof returnedData === 'object' ?
                                        <pre>{JSON.stringify(returnedData, null, 2)}</pre> :
                                        returnedData
                        }
                    </div> */}


                </div>



            </MainContainer>
        </Layout>
    )
}

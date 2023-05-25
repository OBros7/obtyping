import { visibility2int, lang2int } from '@/MyLib/Mapper'
import { findCategoryAndSubcategoryIds } from './UtilsTyping'

const fastAPIURL = process.env.FASTAPI_URL + '/api/typing/'

/////////////////////////////////////// Interface for post request ///////////////////////////////////////


interface ReceivedText {
    text_id: number,
    title: string,
    text11: string,
    text12?: string,
    text21?: string,
    text22?: string,
    category?: string,
    subcategory?: string,
    level?: string,
    lang1_int: number,
    lang2_int?: number,
    visibility_int: number,
    shuffle: boolean,
    deck_id?: number,
}

interface ReceivedDeck {
    deck_id: number,
    title: string,
    description?: string,
}

/////////////////////////////////////// Util function ///////////////////////////////////////

const urlListGetDeck = [
    'get_decklist_by_user',
    'get_decklist_basic',
    'get_decklist_selective',
    'get_decklist_private',
    'get_decklist_by_category',
    'get_decklist_by_search'
]

const urlListGetText = [
    'get_textlist_by_deck',
]

interface getDeckParams {
    url: string,
    userID?: number | null,
    lang1?: string,
    lang2?: string,
    category?: string,
    subcategory?: string,
    level?: string,
    nSelect?: number,
    orderBy?: string,
}

interface getDeckTextParams {
    user_id?: number | null,
    lang1_int?: number | null,
    lang2_int?: number | null,
    category?: string | null,
    subcategory?: string | null,
    level?: string | null,
    n_select?: number | null,
    order_by?: string | null,
    deck_id?: number | null,
}



/////////////////////////////////////// API GET function ///////////////////////////////////////
const getDeckTextList = async (
    url: string,
    userID: number | null,
    lang1: string,
    lang2: string,
    category: string,
    subcategory: string,
    level: string,
    nSelect: number,
    orderBy: string,
    deckID: number,
) => {
    // common queries
    let data: { [index: string]: any } = {
        n_select: nSelect,
        order_by: orderBy,
    }


    //////////////////////// decklist ///////////////////////////////
    if (url.includes('get_decklist_by_user')) {
        data['user_id'] = userID
    } else if (url.includes('get_decklist_basic')) {
        data['lang1_int'] = lang2int[lang1]
        if (lang2int[lang2]) data['lang2_int'] = lang2int[lang2]
    } else if (url.includes('get_decklist_selective')) {
        data['user_id'] = userID
        data['lang1_int'] = lang2int[lang1]
        if (lang2int[lang2]) data['lang2_int'] = lang2int[lang2]
    } else if (url.includes('get_decklist_private')) {
        data['user_id'] = userID
    } else if (url.includes('get_decklist_by_category')) {
        // const { categoryID, subcategoryID } = findCategoryAndSubcategoryIds(null, category, subcategory)
        // data['user_id'] = userID
        // if (categoryID != -1) {
        //     data['category'] = categoryID
        //     if (subcategoryID != -1) {
        //         data['subcategory'] = subcategoryID
        //     }
        // }
        // if (levelID != -1) data['level'] = levelID
    }
    //////////////////////// textlist ///////////////////////////////
    else if (url.includes('get_textlist_basic')) {
    } else if (url.includes('get_textlist_selective')) {
    } else if (url.includes('get_textlist_private')) {
    } else if (url.includes('get_textlist_by_deck')) {
        if (deckID > -1) data['deck_id'] = deckID
    } else {
        console.log('Invalid URL')
        return
    }

    const queryString = Object.keys(data)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key as keyof typeof data])}`)
        .join('&');

    // send get request
    console.log(`${url}?${queryString}`)
    const res = await fetch(`${url}?${queryString}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const resJSON = await res.json()
    return resJSON
}

const getDeckListByUser = async (
    userID: number | null,
    nSelect: number = 10,
    orderBy: string = 'title',
) => {
    const url = fastAPIURL + 'get_decklist_by_user'

    const data = {
        user_id: userID,
        n_select: nSelect,
        order_by: orderBy,
    }

    const queryString = Object.keys(data)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key as keyof typeof data])}`)
        .join('&');

    // send get request
    console.log(`${url}?${queryString}`)
    const res = await fetch(`${url}?${queryString}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const resJSON = await res.json()
    return resJSON
}

const getBasisDeckList = async (
    lang1: string,
    lang2: string,
    nSelect: number = 10,
    orderBy: string = 'title',
) => {
    const url = fastAPIURL + 'get_decklist_basic'
    let data: getDeckTextParams = {
        lang1_int: lang2int[lang1],
        n_select: nSelect,
        order_by: orderBy,
    }
    if (lang2int[lang2]) data['lang2_int'] = lang2int[lang2]

    const queryString = Object.keys(data)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key as keyof typeof data])}`)
        .join('&');

    // send get request
    const res = await fetch(`${url}?${queryString}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const resJSON = await res.json()
    return resJSON
}


const setQueryParams = (
    url: string,
    userID: number | null,
    lang1: string,
    lang2: string,
    category: string,
    subcategory: string,
    level: string,
    nSelect: number,
    orderBy: string,
    deckID: number,
) => {
    // common queries
    let data: { [index: string]: any } = {
        lang1_int: lang2int[lang1],
        n_select: nSelect,
        order_by: orderBy,
    }
    if (lang2int[lang2]) data['lang2_int'] = lang2int[lang2]


    //////////////////////// decklist ///////////////////////////////
    if (url.includes('get_decklist_by_user')) {
        data['user_id'] = userID
    } else if (url.includes('get_decklist_basic')) {
        data['user_id'] = userID
    } else if (url.includes('get_decklist_selective')) {
        data['category'] = category
        data['subcategory'] = subcategory
        data['level'] = level
    } else if (url.includes('get_decklist_private')) {
        data['user_id'] = userID
    } else if (url.includes('get_decklist_by_category')) {
        const { categoryID, subcategoryID } = findCategoryAndSubcategoryIds(null, category, subcategory)
        data['user_id'] = userID
        if (categoryID != -1) {
            data['category'] = categoryID
            if (subcategoryID != -1) {
                data['subcategory'] = subcategoryID
            }
        }
        if (levelID != -1) data['level'] = levelID
    }
    //////////////////////// textlist ///////////////////////////////
    else if (url.includes('get_textlist_basic')) {
    } else if (url.includes('get_textlist_selective')) {
        data['category'] = category
        data['subcategory'] = subcategory
        data['level'] = level

    } else if (url.includes('get_textlist_private')) {
        console.log('get_textlist_private')
        data['user_id'] = userID
    } else if (url.includes('get_textlist_by_deck')) {
        data['deck_id'] = deckID
        // } else if (url.includes('get_textlist_by_decklist')) {
        //     data['deck_id'] = deckID
    } else if (url.includes('get_textlist_by_category')) {
        console.log('get_textlist_by_category')
    } else if (url.includes('get_textlist_by_subcategory')) {
        console.log('get_textlist_by_subcategory')
    } else if (url.includes('get_textlist_by_level')) {
        console.log('get_textlist_by_level')
    } else {
        console.log('Invalid URL')
    }
    return data
}

/////////////////////////////////////// API POST function ///////////////////////////////////////
interface PostText {
    user_id: number,
    title: string,
    text11: string,
    text12?: string | null,
    text21?: string | null,
    text22?: string | null,
    category?: string | null,
    subcategory?: string | null,
    level?: string | null,
    lang1_int: number,
    lang2_int?: number | null,
    visibility_int: number,
    shuffle: boolean,
    deck_id?: number,
}


interface PostDeck {
    user_id: number,
    title: string,
    description?: string | null,
    category?: string | null,
    subcategory?: string | null,
    level?: string,
    lang1_int: number,
    lang2_int?: number | null,
    visibility_int: number,
    shuffle?: boolean,
}

const createText = async (data: PostText) => {
    const url = fastAPIURL + 'create_text'
    // post data to url
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        mode: 'cors',
    })
    const json = await res.json()
    return json
}

const createDeck = async (data: PostDeck) => {
    const url = fastAPIURL + 'create_deck'
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        mode: 'cors',
    })
    const json = await res.json()
    return json
}


/////////////////////////////////////// Export ///////////////////////////////////////


export type {
    PostText,
    PostDeck,
    ReceivedText,
    ReceivedDeck
}
export {
    createDeck,
    createText,
    getDeckTextList,
    getDeckListByUser,
    setQueryParams
}
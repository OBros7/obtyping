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
    search_text?: string | null,
}



/////////////////////////////////////// API GET function ///////////////////////////////////////

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

const getDeckListBasic = async (
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


const getDeckListSelective = async (
    userID: number | null,
    lang1: string,
    nSelect: number = 10,
    orderBy: string = 'title',
) => {
    const url = fastAPIURL + 'get_decklist_selective'
    let data: getDeckTextParams = {
        user_id: userID,
        lang1_int: lang2int[lang1],
        n_select: nSelect,
        order_by: orderBy,
    }
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


const getDeckListPrivate = async (
    userID: number | null,
    nSelect: number = 10,
    orderBy: string = 'title',
) => {
    const url = fastAPIURL + 'get_decklist_private'
    const data: getDeckTextParams = {
        user_id: userID,
        n_select: nSelect,
        order_by: orderBy,
    }
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
const getDeckListByCategory = async (
    userID: number | null,
    category: string,
    subcategory: string,
    level: string,
    nSelect: number = 10,
    orderBy: string = 'title',
) => {
    const url = fastAPIURL + 'get_decklist_by_category'
    const data: getDeckTextParams = {
        user_id: userID,
        category: category,
        subcategory: subcategory,
        level: level,
        n_select: nSelect,
        order_by: orderBy,
    }
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

const getDeckListBySearch = async (
    userID: number | null,
    searchText: string,
    nSelect: number = 10,
    orderBy: string = 'title',
) => {
    const url = fastAPIURL + 'get_decklist_by_search'
    const data: getDeckTextParams = {
        user_id: userID,
        search_text: searchText,
        n_select: nSelect,
        order_by: orderBy,
    }
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

const getTextListByDeck = async (
    deckID: number,
    nSelect: number = 10,
    orderBy: string = 'title',
) => {
    const url = fastAPIURL + 'get_textlist_by_deck'
    const data: getDeckTextParams = {
        deck_id: deckID,
        n_select: nSelect,
        order_by: orderBy,
    }
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
    getDeckListByUser,
    getDeckListBasic,
    getDeckListSelective,
    getDeckListPrivate,
    getDeckListByCategory,
    getDeckListBySearch,
    getTextListByDeck,
}
import { visibility2int, lang2int } from '@/MyLib/Mapper'

const fastAPIURL = process.env.FASTAPI_URL + '/api/typing/'

/////////////////////////////////////// Interface for post request ///////////////////////////////////////
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
    lang2_int?: number,
    visibility_int: number,
    shuffle: boolean,
}


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
const getContents = async (
    url: string,
    userID: number | null,
    lang1: string,
    lang2: string,
    category: string,
    subcategory: string,
    level: string,
    nSelect: number,
    orderBy: string,
) => {
}

const getDeckListByUser = async (
    userID: number | null,
    nSelect: number = 10,
    orderBy: string = 'title',
) => {
    const url = fastAPIURL + 'get_decklist_by_user'

    const data = setQueryParams(
        url,//url
        userID,
        'None',//lang1
        'None',//lang2
        '',//category
        '',//subcategory
        '',//level
        nSelect,
        orderBy)
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
    deckIDList: [number] | null = null,
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
        data['user_id'] = userID
        data['category'] = category
    } else if (url.includes('get_decklist_by_subcategory')) {
        data['user_id'] = userID
        data['category'] = category
    } else if (url.includes('get_decklist_by_level')) {
        data['user_id'] = userID
        data['category'] = category
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
    } else if (url.includes('get_textlist_by_decklist')) {
        data['deck_id_list'] = deckIDList
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




export type {
    PostText,
    PostDeck,
    ReceivedText,
    ReceivedDeck
}
export {
    getDeckListByUser,
    setQueryParams
}
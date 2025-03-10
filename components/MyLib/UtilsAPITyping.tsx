// components/MyLib/UtilsAPITyping.tsx

import { visibility2int, lang2int } from '@/MyLib/Mapper'
// import { findCategoryAndSubcategoryIds } from './UtilsTyping'
// import { create } from 'domain';
// import { fetchFromBackend } from '@api/typing/typingGet'

const fastAPIURL = process.env.FASTAPI_URL + '/api/typing/'
const BACKEND_API_KEY = process.env.BACKEND_API_KEY || ''

/////////////////////////////////////// Interface for post request ///////////////////////////////////////

interface ReceivedText {
    text_id: number,
    title: string,
    text11: string,
    text12?: string | null,
    text21?: string | null,
    text22?: string | null,
    // category?: string,
    // subcategory?: string,
    // level?: string,
    // lang1_int: number,
    // lang2_int?: number,
    visibility_int?: number,
    // shuffle: boolean,
    deck_id?: number,
}

interface ReceivedDeck {
    deck_id: number,
    title: string,
    description?: string,
    visibility_int?: number,
    shuffle?: boolean,
    category?: string,
    subcategory?: string,
    level?: string,
    lang1_int: number,
    lang2_int?: number,
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
const createQueryString = (data: getDeckTextParams) => {
    const queryString = Object.keys(data)
        .filter((key) => data[key as keyof typeof data] !== undefined)  // Filter out undefined values
        .map((key) => {
            const value = data[key as keyof typeof data]
            if (value !== undefined) { // Check to ensure value is not undefined
                return `${encodeURIComponent(key)}=${encodeURIComponent(value as string | number | boolean)}`
            }
        })
        .join('&');
    return queryString
}


const getDeckListByUser = async (
    userID: number | null,
    nSelect: number = 10,
    orderBy: string = 'title',
) => {
    const data = {
        user_id: userID,
        n_select: nSelect,
        order_by: orderBy,
    }
    // const response = await fetch('/api/typing/typingGet', {
    const response = await fetch('/api/dataRequestFastAPI', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ method: 'GET', endpoint: 'get_decklist_by_user', data: data }),
    });
    const result = await response.json();
    return result;
}

const getDeckListBasic = async (
    lang1: string,
    nSelect: number = 10,
    orderBy: string = 'title',
) => {
    const data = {
        lang1_int: lang2int(lang1),
        n_select: nSelect,
        order_by: orderBy,
    }
    // const response = await fetch('/api/typing/typingGet', {
    const response = await fetch('/api/dataRequestFastAPI', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ method: 'GET', endpoint: 'get_decklist_basic', data: data }),
    });
    const result = await response.json();
    return result;
}
// これはクライアント→fastAPIへのリクエストを送る関数
// const getDeckListBasic = async (
//     lang1: string,
//     nSelect: number = 10,
//     orderBy: string = 'title',
// ) => {
//     const url = fastAPIURL + 'get_decklist_basic'
//     let data: getDeckTextParams = {
//         lang1_int: lang2int(lang1),
//         n_select: nSelect,
//         order_by: orderBy,
//     }
//     const queryString = createQueryString(data)

//     // send get request
//     const res = await fetch(`${url}?${queryString}`, {
//         method: 'GET',
//         headers: {
//             'X-API-Key': BACKEND_API_KEY,
//             'Content-Type': 'application/json',
//         },
//     })
//     const resJSON = await res.json()
//     return resJSON
// }

const getDeckListSelective = async (
    userID: number | null,
    lang1: string,
    nSelect: number = 10,
    orderBy: string = 'title',
) => {
    const data = {
        user_id: userID,
        lang1_int: lang2int(lang1),
        n_select: nSelect,
        order_by: orderBy,
    }
    // const response = await fetch('/api/typing/typingGet', {
    const response = await fetch('/api/dataRequestFastAPI', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ method: 'GET', endpoint: 'get_decklist_selective', data: data }),
    });
    const result = await response.json();
    return result;
}

// これはクライアント→fastAPIへのリクエストを送る関数
// const getDeckListSelective = async (
//     userID: number | null,
//     lang1: string,
//     nSelect: number = 10,
//     orderBy: string = 'title',
// ) => {
//     const url = fastAPIURL + 'get_decklist_selective'
//     let data: getDeckTextParams = {
//         user_id: userID,
//         lang1_int: lang2int(lang1),
//         n_select: nSelect,
//         order_by: orderBy,
//     }
//     const queryString = createQueryString(data)


//     // send get request
//     const res = await fetch(`${url}?${queryString}`, {
//         method: 'GET',
//         headers: {
//             'X-API-Key': BACKEND_API_KEY,
//             'Content-Type': 'application/json',
//         },
//     })
//     const resJSON = await res.json()
//     return resJSON
// }

const getDeckListPrivate = async (
    userID: number | null,
    nSelect: number = 10,
    orderBy: string = 'title',
) => {
    const data = {
        user_id: userID,
        n_select: nSelect,
        order_by: orderBy,
    }
    // const response = await fetch('/api/typing/typingGet', {
    const response = await fetch('/api/dataRequestFastAPI', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ method: 'GET', endpoint: 'get_decklist_private', data: data }),
    });
    const result = await response.json();
    return result;
}


// これはクライアント→fastAPIへのリクエストを送る関数
// const getDeckListPrivate = async (
//     userID: number | null,
//     nSelect: number = 10,
//     orderBy: string = 'title',
// ) => {
//     const url = fastAPIURL + 'get_decklist_private'
//     const data: getDeckTextParams = {
//         user_id: userID,
//         n_select: nSelect,
//         order_by: orderBy,
//     }
//     const queryString = createQueryString(data)

//     // send get request
//     const res = await fetch(`${url}?${queryString}`, {
//         method: 'GET',
//         headers: {
//             'X-API-Key': BACKEND_API_KEY,
//             'Content-Type': 'application/json',
//         },
//     })
//     const resJSON = await res.json()
//     return resJSON
// }

const getDeckListByCategory = async (
    userID: number | null,
    category: string,
    subcategory: string,
    level: string,
    nSelect: number = 10,
    orderBy: string = 'title',
) => {
    const data = {
        user_id: userID,
        category: category,
        subcategory: subcategory,
        level: level,
        n_select: nSelect,
        order_by: orderBy,
    }
    // const response = await fetch('/api/typing/typingGet', {
    const response = await fetch('/api/dataRequestFastAPI', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ method: 'GET', endpoint: 'get_decklist_by_category', data: data }),
    });
    const result = await response.json();
    return result;
}

// これはクライアント→fastAPIへのリクエストを送る関数
// const getDeckListByCategory = async (
//     userID: number | null,
//     category: string,
//     subcategory: string,
//     level: string,
//     nSelect: number = 10,
//     orderBy: string = 'title',
// ) => {
//     const url = fastAPIURL + 'get_decklist_by_category'
//     const data: getDeckTextParams = {
//         user_id: userID,
//         category: category,
//         subcategory: subcategory,
//         level: level,
//         n_select: nSelect,
//         order_by: orderBy,
//     }
//     const queryString = createQueryString(data)


//     // send get request
//     const res = await fetch(`${url}?${queryString}`, {
//         method: 'GET',
//         headers: {
//             'X-API-Key': BACKEND_API_KEY,
//             'Content-Type': 'application/json',
//         },
//     })
//     const resJSON = await res.json()
//     return resJSON
// }

const getDeckListBySearch = async (
    userID: number | null,
    searchText: string,
    nSelect: number = 10,
    orderBy: string = 'title',
) => {
    const data = {
        user_id: userID,
        search_text: searchText,
        n_select: nSelect,
        order_by: orderBy,
    }
    // const response = await fetch('/api/typing/typingGet', {
    const response = await fetch('/api/dataRequestFastAPI', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ method: 'GET', endpoint: 'get_decklist_by_search', data: data }),
    });
    const result = await response.json();
    return result;
}


// これはクライアント→fastAPIへのリクエストを送る関数
// const getDeckListBySearch = async (
//     userID: number | null,
//     searchText: string,
//     nSelect: number = 10,
//     orderBy: string = 'title',
// ) => {
//     const url = fastAPIURL + 'get_decklist_by_search'
//     const data: getDeckTextParams = {
//         user_id: userID,
//         search_text: searchText,
//         n_select: nSelect,
//         order_by: orderBy,
//     }
//     const queryString = createQueryString(data)


//     // send get request
//     const res = await fetch(`${url}?${queryString}`, {
//         method: 'GET',
//         headers: {
//             'X-API-Key': BACKEND_API_KEY,
//             'Content-Type': 'application/json',
//         },
//     })
//     const resJSON = await res.json()
//     return resJSON
// }

const getTextListByDeck = async (
    deckID: number,
    nSelect: number = 10,
    orderBy: string = 'title',
) => {
    const data = {
        deck_id: deckID,
        n_select: nSelect,
        order_by: orderBy,
    }
    // const response = await fetch('/api/typing/typingGet', {
    const response = await fetch('/api/dataRequestFastAPI', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ method: 'GET', endpoint: 'get_textlist_by_deck', data: data }),
    });
    const result = await response.json();
    return result;
}

// これはクライアント→fastAPIへのリクエストを送る関数
// const getTextListByDeck = async (
//     deckID: number,
//     nSelect: number = 10,
//     orderBy: string = 'title',
// ) => {
//     const url = fastAPIURL + 'get_textlist_by_deck'
//     const data: getDeckTextParams = {
//         deck_id: deckID,
//         n_select: nSelect,
//         order_by: orderBy,
//     }
//     const queryString = createQueryString(data)


//     // send get request
//     const res = await fetch(`${url}?${queryString}`, {
//         method: 'GET',
//         headers: {
//             'X-API-Key': BACKEND_API_KEY,
//             'Content-Type': 'application/json',
//         },
//     })
//     const resJSON = await res.json()
//     return resJSON
// }

const getCategoriesSubcategoriesLevels = async () => {
    // const response = await fetch('/api/typing/typingGet', {
    const response = await fetch('/api/dataRequestFastAPI', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ method: 'GET', endpoint: 'get_categories_subcategories_levels' }),
    });
    const result = await response.json();
    return result;
}

// これはクライアント→fastAPIへのリクエストを送る関数
// const getCategoriesSubcategoriesLevels = async () => {
//     const url = fastAPIURL + 'get_categories_subcategories_levels'
//     const res = await fetch(url, {
//         method: 'GET',
//         headers: {
//             'X-API-Key': BACKEND_API_KEY,
//             'Content-Type': 'application/json',
//         },
//     })
//     const resJSON = await res.json()
//     return resJSON

// }


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
    deck_title?: string,
    deck_description?: string,
}

interface PostTextOnly {
    user_id: number,
    title: string,
    text11: string,
    text12?: string | null,
    text21?: string | null,
    text22?: string | null,
    visibility_int: number,
    deck_id: number,
}


interface PostTextDeck {
    // text & deck property
    user_id: number
    // text property
    title: string
    text11: string
    text12?: string | null,
    text21?: string | null,
    text22?: string | null,
    // deck property
    deck_title: string
    deck_description: string | null,
    lang1_int: number
    lang2_int: number | null
    // category_id: number | null
    // subcategory_id: number | null
    // level_id: number | null
    category: string | null
    subcategory: string | null
    level: string | null
    shuffle: boolean
    visibility_int: number
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

interface DeckListByDeck {

}

const createText = async (data: PostText) => {
    // const response = await fetch('/api/typing/typingPost', {
    const response = await fetch('/api/dataRequestFastAPI', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ method: 'POST', endpoint: 'create_text', data: data }),
    });
    const result = await response.json();
    return result;
}

// これはクライアント→fastAPIへのリクエストを送る関数
// const createText = async (data: PostText) => {
//     const url = fastAPIURL + 'create_text'
//     // post data to url
//     const res = await fetch(url, {
//         method: 'POST',
//         headers: {
//             'X-API-Key': BACKEND_API_KEY,
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//         mode: 'cors',
//     })
//     const json = await res.json()
//     return json
// }

const createTextOnly = async (data: PostTextOnly) => {
    // const response = await fetch('/api/typing/typingPost', {
    const response = await fetch('/api/dataRequestFastAPI', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ method: 'POST', endpoint: 'create_text_only', data: data }),
    });
    const result = await response.json();
    return result;
}

// これはクライアント→fastAPIへのリクエストを送る関数
// const createTextOnly = async (data: PostTextOnly) => {
//     const url = fastAPIURL + 'create_text_only'
//     // post data to url
//     const res = await fetch(url, {
//         method: 'POST',
//         headers: {
//             'X-API-Key': BACKEND_API_KEY,
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//         mode: 'cors',
//     })
//     const json = await res.json()
//     return json
// }

const createTextDeck = async (data: PostTextDeck) => {
    // const response = await fetch('/api/typing/typingPost', {
    const response = await fetch('/api/dataRequestFastAPI', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ method: 'POST', endpoint: 'create_text_deck', data: data }),
    });
    const result = await response.json();
    return result;
}
// これはクライアント→fastAPIへのリクエストを送る関数
// const createTextDeck = async (data: PostTextDeck) => {
//     const url = fastAPIURL + 'create_text_deck'
//     // post data to url
//     const res = await fetch(url, {
//         method: 'POST',
//         headers: {
//             'X-API-Key': BACKEND_API_KEY,
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//         mode: 'cors',
//     })
//     const json = await res.json()
//     return json
// }

const createDeck = async (data: PostDeck) => {
    // const response = await fetch('/api/typing/typingPost', {
    const response = await fetch('/api/dataRequestFastAPI', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ method: 'POST', endpoint: 'create_deck', data: data }),
    });
    const result = await response.json();
    return result;
}

// これはクライアント→fastAPIへのリクエストを送る関数
// const createDeck = async (data: PostDeck) => {
//     const url = fastAPIURL + 'create_deck'
//     const res = await fetch(url, {
//         method: 'POST',
//         headers: {
//             'X-API-Key': BACKEND_API_KEY,
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//         mode: 'cors',
//     })
//     const json = await res.json()
//     return json
// }

// 型は？？？
const getDeckListByDeck = async (data: DeckListByDeck) => {
    const response = await fetch('/api/dataRequestFastAPI', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ method: 'POST', endpoint: 'get_decklist_by_deck', data: data }),
    });
    const result = await response.json();
    return result;
}


/////////////////////////////////////// Export ///////////////////////////////////////


export type {
    PostText,
    PostDeck,
    PostTextOnly,
    PostTextDeck,
    ReceivedText,
    ReceivedDeck,
    getDeckTextParams,
}
export {
    createDeck,
    createText,
    createTextOnly,
    createTextDeck,
    getDeckListByUser,
    getDeckListBasic,
    getDeckListSelective,
    getDeckListPrivate,
    getDeckListByCategory,
    getDeckListBySearch,
    getTextListByDeck,
    getCategoriesSubcategoriesLevels,
    getDeckListByDeck,
}
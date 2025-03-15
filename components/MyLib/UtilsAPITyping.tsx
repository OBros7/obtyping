// components/MyLib/UtilsAPITyping.tsx

import { visibility2int, lang2int } from '@/MyLib/Mapper'
import { fetchWithAuth } from '@/MyLib/UtilsAPIUser';

/**
 * In your .env (or .env.local), you might have something like:
 * NEXT_PUBLIC_BACKEND_URL="http://localhost:8000"
 */
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ---------------- Interfaces for responses ----------------
interface ReceivedText {
    text_id: number,
    title: string,
    text11: string,
    text12?: string | null,
    text21?: string | null,
    text22?: string | null,
    visibility_int?: number,
    deck_id?: number,
}

interface ReceivedDeck {
    deck_id: number,
    title: string,
    description?: string,
    visibility_int?: number,
    shuffle?: boolean,
    lang1_int: number,
    lang2_int?: number,
    // If your API returns category/subcategory/level as plain strings,
    // you can keep them here or remove if not needed.
    // category?: string,
    // subcategory?: string,
    // level?: string,
}

// --------------- Utility function for GET query strings ---------------
// export interface getDeckTextParams {
//     user_id?: number | null,
//     lang1_int?: number | null,
//     lang2_int?: number | null,
//     category?: string | null,
//     subcategory?: string | null,
//     level?: string | null,
//     n_select?: number | null,
//     order_by?: string | null,
//     deck_id?: number | null,
//     search_text?: string | null,
// }

/** Build a query string from an object, skipping undefined/null values. */
const createQueryString = (data: Record<string, any>) => {
    return Object.entries(data)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');
};

// ---------------- API: GET routes ----------------

/**
 * GET /api/typing/get_decklist_by_user
 */
const getDeckListByUser = async (
    userID: number | null,
    nSelect: number = 10,
    orderBy: string = 'title',
) => {
    // Build query
    const data = {
        n_select: nSelect,
        order_by: orderBy,
        // current_user is determined by your JWT, so userID
        // might not be required if your backend is ignoring the input user_id.
        // But if your FastAPI endpoint expects user_id in the query, include it:
        user_id: userID,
    };
    const qs = createQueryString(data);
    const url = `${BACKEND_URL}/api/typing/get_decklist_by_user?${qs}`;

    const response = await fetchWithAuth(url, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
};

/**
 * GET /api/typing/get_decklist_basic
 */
const getDeckListBasic = async (
    lang1: string,
    nSelect: number = 10,
    orderBy: string = 'title',
) => {
    const data = {
        lang1_int: lang2int(lang1),
        n_select: nSelect,
        order_by: orderBy,
    };
    const qs = createQueryString(data);
    const url = `${BACKEND_URL}/api/typing/get_decklist_basic?${qs}`;

    const response = await fetchWithAuth(url, { method: 'GET' });
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
};

/**
 * GET /api/typing/get_decklist_private
 */
const getDeckListPrivate = async (
    userID: number | null,
    nSelect: number = 10,
    orderBy: string = 'title',
) => {
    const data = {
        user_id: userID,
        n_select: nSelect,
        order_by: orderBy,
    };
    const qs = createQueryString(data);
    const url = `${BACKEND_URL}/api/typing/get_decklist_private?${qs}`;

    const response = await fetchWithAuth(url, { method: 'GET' });
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
};

/**
 * GET /api/typing/get_decklist_by_category
 */
const getDeckListByCategory = async (
    category: string,
    subcategory: string,
    level: string,
    nSelect: number = 10,
    orderBy: string = 'title',
) => {
    const data = {
        category,
        subcategory,
        level,
        n_select: nSelect,
        order_by: orderBy,
    };
    const qs = createQueryString(data);
    const url = `${BACKEND_URL}/api/typing/get_decklist_by_category?${qs}`;

    const response = await fetchWithAuth(url, { method: 'GET' });
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
};


/**
 * GET /api/typing/get_textlist_by_deck
 */
const getTextListByDeck = async (
    deckID: number,
    nSelect: number = 10,
    orderBy: string = 'title',
) => {
    const data = {
        deck_id: deckID,
        n_select: nSelect,
        order_by: orderBy,
    };
    const qs = createQueryString(data);
    const url = `${BACKEND_URL}/api/typing/get_textlist_by_deck?${qs}`;

    const response = await fetchWithAuth(url, { method: 'GET' });
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
};

/**
 * GET /api/typing/get_categories_subcategories_levels
 */
const getCategoriesSubcategoriesLevels = async () => {
    const url = `${BACKEND_URL}/api/typing/get_categories_subcategories_levels`;
    const response = await fetchWithAuth(url, { method: 'GET' });
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
};

// ---------------- API: POST routes ----------------
interface PostTextOnly {
    // user_id: number,
    title: string,
    text11: string,
    text12?: string | null,
    text21?: string | null,
    text22?: string | null,
    visibility_int: number,
    deck_id: number,
}

interface PostTextDeck {
    // user_id: number;
    // text property
    title: string;
    text11: string;
    text12?: string | null,
    text21?: string | null,
    text22?: string | null,
    // deck property
    deck_title: string;
    deck_description: string | null;
    lang1_int: number;
    lang2_int: number | null;
    category: string | null;
    subcategory: string | null;
    level: string | null;
    shuffle: boolean;
    visibility_int: number;
}

interface PostDeck {
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

/**
 * POST /api/typing/create_text_only
 */
const createTextOnly = async (data: PostTextOnly) => {
    const url = `${BACKEND_URL}/api/typing/create_text_only`;
    const response = await fetchWithAuth(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
};

/**
 * POST /api/typing/create_text_deck
 */
const createTextDeck = async (data: PostTextDeck) => {
    const url = `${BACKEND_URL}/api/typing/create_text_deck`;
    const response = await fetchWithAuth(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
};

/**
 * POST /api/typing/create_deck
 */
const createDeck = async (data: PostDeck) => {
    const url = `${BACKEND_URL}/api/typing/create_deck`;
    const response = await fetchWithAuth(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
};

// -------------- Export everything --------------
export type {
    ReceivedText,
    ReceivedDeck,
    PostTextOnly,
    PostTextDeck,
    PostDeck,
};
export {
    createDeck,
    createTextOnly,
    createTextDeck,
    getDeckListByUser,
    getDeckListBasic,
    getDeckListPrivate,
    getDeckListByCategory,
    getTextListByDeck,
    getCategoriesSubcategoriesLevels,
    createQueryString,
};

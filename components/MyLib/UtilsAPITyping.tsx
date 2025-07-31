// components/MyLib/UtilsAPITyping.tsx

// -----------------------------------------------------
// 残課題：複数の外部ファイルからインポートされる型を別ファイルに分けるか
// -----------------------------------------------------

import { visibility2int, lang2int } from '@/MyLib/Mapper'
import { fetchWithAuth } from '@/MyLib/UtilsAPIUser';
import { apiFetch } from '@/MyLib/apiFetch'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';     // ★ フォールバック

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

// ---------------- Interfaces for responses ----------------
// ---------------- API: POST routes ----------------
// interface PostText {
//     // user_id: number,
//     title: string,
//     text11: string,
//     text12?: string | null,
//     text21?: string | null,
//     text22?: string | null,
//     visibility_int: number,
//     deck_id: number,
// }

// バックエンドに合わせる
interface PostText {
    title: string,
    text11: string,
    text12?: string | null,
    deck_id: number,
}

interface PostTextDeck {
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

// 元々
// interface PostDeck {
//     title: string,
//     description?: string | null,
//     category?: string | null,
//     subcategory?: string | null,
//     level?: string,
//     lang1_int: number,
//     lang2_int?: number | null,
//     visibility_int: number,
//     shuffle?: boolean,
// }

// バックエンドに合わせる
interface PostDeck {
    title: string,
    description?: string | null,
    lang: string,
    visibility: string,
    typing_mode: string,
    category_id?: number | null,
    subcategory_id?: number | null,
    level_id?: number | null,
    shuffle?: boolean,
}

// deck_id / visibility_int は後から補完するので一旦消しておく
type NewTextForDeck = Omit<PostText, 'deck_id' | 'visibility_int'> & {
    visibility_int?: number;
};

interface CreateDeckWithTextsArgs {
    deck: PostDeck;
    texts: NewTextForDeck[];
    defaultTextVisibility?: number;
}


/** クエリ文字列生成 */
const qs = (o: Record<string, any>) =>
    Object.entries(o)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&');

/* ============ GET APIs ============ */

/** GET /api/typing/get_decklist_by_user */
export const getDeckListByUser = (userID: number | null, nSelect = 10, orderBy = 'title') =>
    apiFetch<ReceivedDeck[]>(
        `${BACKEND}/api/typing/get_decklist_by_user?${qs({ user_id: userID, n_select: nSelect, order_by: orderBy })}`,
    );

/** GET /api/typing/get_decklist_basic */
export const getDeckListBasic = (lang1: string, nSelect = 10, orderBy = 'title') =>
    apiFetch<ReceivedDeck[]>(
        `${BACKEND}/api/typing/get_decklist_basic?${qs({
            lang1_int: lang2int(lang1),
            n_select: nSelect,
            order_by: orderBy,
        })}`,
    );

/** 以下同じパターンで… */
export const getDeckListPrivate = (userID: number | null, nSelect = 10, orderBy = 'title') =>
    apiFetch<ReceivedDeck[]>(
        `${BACKEND}/api/typing/get_decklist_custom_by_user?${qs({ user_id: userID, n_select: nSelect, order_by: orderBy })}`,
    );

export const getDeckListByCategory = (
    category: string,
    subcategory: string,
    level: string,
    nSelect = 10,
    orderBy = 'title',
) =>
    apiFetch<ReceivedDeck[]>(
        `${BACKEND}/api/typing/get_decklist_by_category?${qs({ category, subcategory, level, n_select: nSelect, order_by: orderBy })}`,
    );

export const getTextListByDeck = (deckID: number, nSelect = 10, orderBy = 'title') =>
    apiFetch(
        `${BACKEND}/api/typing/get_textlist_by_deckid?${qs({ deck_id: deckID, n_select: nSelect, order_by: orderBy })}`,
    );

export const getCategoriesSubcategoriesLevels = () =>
    apiFetch(`${BACKEND}/api/typing/get_categories_subcategories_levels/`);

/* ============ POST APIs ============ */

export const createText = (data: PostText) =>
    apiFetch(`${BACKEND}/api/typing/create_text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

export const createTextDeck = (data: PostTextDeck) =>
    apiFetch(`${BACKEND}/api/typing/create_text_deck`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

export const createDeck = (data: PostDeck) =>
    apiFetch(`${BACKEND}/api/typing/create_deck`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

export const createDeckWithTexts = async ({
    deck,
    texts,
}: CreateDeckWithTextsArgs): Promise<ReceivedDeck> => {
    console.log("Creating deck :", deck);
    // 1. デッキ作成
    const createdDeck = await createDeck(deck);
    console.log("deck created");
    console.log("Created text:", texts);
    // 2. テキスト一括登録
    await Promise.all(
        texts.map((t) =>
            createText({
                ...t,
                deck_id: createdDeck.deck_id,
            }),
        ),
    );
    console.log("Texts created for deck:", createdDeck.deck_id);
    return createdDeck;
};



export type {
    ReceivedText,
    ReceivedDeck,
    PostText,
    PostTextDeck,
    PostDeck,
    NewTextForDeck,
    CreateDeckWithTextsArgs,
};
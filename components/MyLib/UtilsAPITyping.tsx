// components/MyLib/UtilsAPITyping.tsx

// -----------------------------------------------------
// 残課題：複数の外部ファイルからインポートされる型を別ファイルに分けるか
// -----------------------------------------------------

import { lang2int } from '@/MyLib/Mapper'
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

// 過去のもの。いずれ消すかも
interface ReceivedDeck {
    deck_id: number,
    title: string,
    description?: string,
    visibility_int?: number,
    shuffle?: boolean,
    lang?: string,
    lang1_int: number,
    lang2_int?: number,
}

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

type UpdateDeckPayload = Partial<PostDeck> & { deck_id: number };
type UpdateTextPayload = Partial<PostText> & { text_id: number };

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
        undefined,
        { parseJson: true }
    );

/** GET /api/typing/get_decklist_basic */
export const getDeckListBasic = (lang1: string, nSelect = 10, orderBy = 'title') =>
    apiFetch<ReceivedDeck[]>(
        `${BACKEND}/api/typing/get_decklist_basic?${qs({
            lang1_int: lang2int(lang1),
            n_select: nSelect,
            order_by: orderBy,
        })}`,
        undefined,
        { parseJson: true }
    );

export const getDeckListPrivate = (userID: number | null, nSelect = 10, orderBy = 'title') =>
    apiFetch<ReceivedDeck[]>(
        `${BACKEND}/api/typing/get_decklist_custom_by_user?${qs({ user_id: userID, n_select: nSelect, order_by: orderBy })}`,
        undefined,
        { parseJson: true }
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
        undefined,
        { parseJson: true }
    );

export const getTextListByDeck = (deckID: number, nSelect = 10, orderBy = 'title') =>
    apiFetch(
        `${BACKEND}/api/typing/get_textlist_by_deckid?${qs({ deck_id: deckID, n_select: nSelect, order_by: orderBy })}`,
        undefined,
        { parseJson: true }
    );

export const getCategoriesSubcategoriesLevels = () =>
    apiFetch(`${BACKEND}/api/typing/get_categories_subcategories_levels/`, undefined, { parseJson: true });

/* ============ POST APIs ============ */

export const createText = (data: PostText) =>
    apiFetch(`${BACKEND}/api/typing/create_text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }, { parseJson: true });

export const createTextDeck = (data: PostTextDeck) =>
    apiFetch(`${BACKEND}/api/typing/create_text_deck`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }, { parseJson: true });

export const createDeck = (data: PostDeck) =>
    apiFetch(`${BACKEND}/api/typing/create_deck`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }, { parseJson: true });

export const createDeckWithTexts = async ({
    deck,
    texts,
}: CreateDeckWithTextsArgs): Promise<ReceivedDeck> => {
    // 1. デッキ作成
    const createdDeck = await createDeck(deck);

    // 2. テキスト一括登録
    await Promise.all(
        texts.map((t) =>
            createText({
                ...t,
                deck_id: createdDeck.deck_id,
            }),
        ),
    );
    return createdDeck;
};

export const updateText = (data: UpdateTextPayload) =>
    apiFetch(`${BACKEND}/api/typing/update_text`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }, { parseJson: true });

export const updateDeck = (data: UpdateDeckPayload) =>
    apiFetch(`${BACKEND}/api/typing/update_deck`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }, { parseJson: true });

export const deleteDeck = (deckID: number) =>
    apiFetch(`${BACKEND}/api/typing/delete_deck`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deck_id: deckID }),
    }, { parseJson: true });

export const deleteText = (textID: number) =>
    apiFetch(`${BACKEND}/api/typing/delete_text`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text_id: textID }),
    }, { parseJson: true });


export type {
    ReceivedText,
    ReceivedDeck,
    PostText,
    PostTextDeck,
    PostDeck,
    NewTextForDeck,
    CreateDeckWithTextsArgs,
    UpdateDeckPayload,
    UpdateTextPayload,
};
// components/MyLib/UtilsAPIRecord.tsx

import { fetchWithAuth } from '@/MyLib/UtilsAPIUser';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const CREATERECORD_URL = `${BACKEND_URL}/api/typing/create_record_time`;
const GETRECORD_URL = `${BACKEND_URL}/api/typing/get_record_time_by_deckid`;

interface PostRecordTime {
    deck_id: number;
    score: number;
    wpm: number;
    cpm: number;
    accuracy: number;
    seconds: number | null;
}

const createRecordTime = async (data: PostRecordTime) => {
    // POST /api/typing/create_record_time
    const response = await fetchWithAuth(CREATERECORD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
};

const getRecordTime = async (
    deckId: number,
    nSelect: number,
    orderby: string,
) => {
    // Instead of sending POST => Next.js => method: 'GET'
    // we do a direct GET request to /api/typing/get_record_time_by_deckid/
    const qs = new URLSearchParams({
        deck_id: String(deckId),
        n_select: String(nSelect),
        order_by: orderby,
    }).toString();

    const url = `${GETRECORD_URL}/?${qs}`;
    // or simply: `${BACKEND_URL}/api/typing/get_record_time_by_deckid?${qs}`

    const response = await fetchWithAuth(url, {
        method: 'GET'
    });
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
};

export type { PostRecordTime }
export { createRecordTime, getRecordTime }

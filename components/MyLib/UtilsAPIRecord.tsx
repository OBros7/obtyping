// components/MyLib/UtilsAPIRecord.tsx
// React Query 対応版
import { apiFetch } from '@/MyLib/apiFetch';
import {
    useQuery,
    useMutation,
    useQueryClient,
    UseQueryOptions,
    UseMutationOptions,
} from '@tanstack/react-query';

/* ---------- 共通 ---------- */
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';

const qs = (o: Record<string, any>) =>
    Object.entries(o)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&');

/* ---------- 型 ---------- */
export interface PostRecordTime {
    deck_id: number;
    score: number;
    wpm: number;
    cpm: number;
    accuracy: number;
    seconds: number | null;
}

export interface ReceivedRecordTime {
    record_id: number;
    deck_id: number;
    user_id: number;
    score: number;
    wpm: number;
    cpm: number;
    accuracy: number;
    seconds: number | null;
    timestamp: string; // ISO 文字列
}

/* ---------- フェッチ関数 ---------- */
export const createRecordTime = (data: PostRecordTime) =>
    apiFetch<ReceivedRecordTime>(`${BACKEND}/api/typing/create_record_time`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }, { parseJson: true });

/** ↓↓↓ 旧 API（score ソート）は今後使わないなら削除して OK */
export const getRecordTime = (deckId: number, nSelect = 10, orderBy = 'score') =>
    apiFetch<ReceivedRecordTime[]>(
        `${BACKEND}/api/typing/get_record_time_by_deckid?${qs({
            deck_id: deckId,
            n_select: nSelect,
            order_by: orderBy,
        })}`,
        undefined,
        { parseJson: true } // ← 追加
    );

/* ---------- ★★ 追加: 「最近 n 件」用 fetch ---------- */
export const getRecentRecords = (deckId: number, n = 10) =>
    apiFetch<ReceivedRecordTime[]>(
        `${BACKEND}/api/typing/get_record_time_by_deckid?${qs({
            deck_id: deckId,
            n_select: n,
            order_by: 'timestamp',
            desc: true,
        })}`,
        undefined,
        { parseJson: true }
    );

/* ---------- ★★ 追加: 「自己ベスト topK」用 fetch ---------- */
export const getTopScoreRecords = (deckId: number, k = 5) =>
    apiFetch<ReceivedRecordTime[]>(
        `${BACKEND}/api/typing/get_record_time_by_deckid?${qs({
            deck_id: deckId,
            n_select: k,
            order_by: 'score',
            desc: true,
        })}`,
        undefined,
        { parseJson: true }
    );

/* ---------- React Query フック ---------- */
/** 旧フック; 置き換え完了後に削除可 */
export const useRecordTime = (
    deckId: number | undefined,
    nSelect = 10,
    orderBy = 'score',
    options: Omit<UseQueryOptions<ReceivedRecordTime[], Error>, 'queryKey' | 'queryFn'> = {},
) =>
    useQuery({
        queryKey: ['recordTime', deckId, nSelect, orderBy],
        queryFn: () =>
            deckId ? getRecordTime(deckId, nSelect, orderBy) : Promise.resolve([]),
        enabled: !!deckId,
        ...options,
    });

/* ---------- ★★ 追加: 最近履歴フック ---------- */
export const useRecentRecords = (
    deckId: number | undefined,
    n = 10,
    options: Omit<UseQueryOptions<ReceivedRecordTime[], Error>, 'queryKey' | 'queryFn'> = {},
) =>
    useQuery({
        queryKey: ['recentRecords', deckId, n],
        queryFn: () => (deckId ? getRecentRecords(deckId, n) : Promise.resolve([])),
        enabled: !!deckId,
        ...options,
    });

/* ---------- ★★ 追加: 自己ベストフック ---------- */
export const useTopScoreRecords = (
    deckId: number | undefined,
    k = 5,
    options: Omit<UseQueryOptions<ReceivedRecordTime[], Error>, 'queryKey' | 'queryFn'> = {},
) =>
    useQuery({
        queryKey: ['topScoreRecords', deckId, k],
        queryFn: () => (deckId ? getTopScoreRecords(deckId, k) : Promise.resolve([])),
        enabled: !!deckId,
        ...options,
    });

/* ---------- 登録（POST） ---------- */
export const useCreateRecordTime = <TContext = unknown>(
    options: UseMutationOptions<ReceivedRecordTime, Error, PostRecordTime, TContext> = {},
) => {
    const qc = useQueryClient();

    return useMutation<ReceivedRecordTime, Error, PostRecordTime, TContext>({
        mutationFn: createRecordTime,

        /* ---------- ★★ 変更: キャッシュを両方 invalid  ---------- */
        onSuccess: (_data, variables) => {
            const dk = variables.deck_id;
            qc.invalidateQueries({ queryKey: ['recentRecords', dk] });
            qc.invalidateQueries({ queryKey: ['topScoreRecords', dk] });
        },

        ...options,
    });
};

// components/MyLib/UtilsAPIUser.tsx
import { apiFetch } from '@/MyLib/apiFetch';
// export { fetchWithAuth } from './fetchWithAuth'; // ★既存ファイル名に応じて修正
import {
    useMutation,
    useQuery,
    useQueryClient,
    UseMutationOptions,
    UseQueryOptions,
} from '@tanstack/react-query';


export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    // …必要に応じて追加
}

/* ---------- フェッチ関数 ---------- */
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';

export const loginUser = (data: LoginPayload) =>
    apiFetch<LoginResponse>(
        `${BACKEND}/api/user/login`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        },
        { withAuth: false, parseJson: true }, // ← 第 3 引数へ
    );

export const fetchCurrentUser = () =>
    apiFetch<User>(`${BACKEND}/api/user/me`, undefined, { parseJson: true }); // 例: /api/user/me が自分を返す想定

/* ---------- React Query フック ---------- */

/** ログイン */
export const useLogin = (
    options: UseMutationOptions<LoginResponse, Error, LoginPayload, unknown> = {},
) => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            // 新しいトークンを保存して /me をリフェッチ
            localStorage.setItem('accessToken', data.access_token);
            qc.invalidateQueries({ queryKey: ['currentUser'] });
        },
        ...options,
    });
};

/** 現在ログイン中のユーザー */
export const useCurrentUser = (
    options: Omit<UseQueryOptions<User, Error>, 'queryKey' | 'queryFn'> = {},
) =>
    useQuery({
        queryKey: ['currentUser'],
        queryFn: fetchCurrentUser,
        staleTime: 5 * 60 * 1000, // 5 分はキャッシュ
        ...options,
    });

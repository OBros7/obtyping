// hooks/useCategories.ts (v5 対応版)
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/MyLib/apiFetch'
import { ApiError } from '@/MyLib/apiError'
import { showError } from 'utils/toast'
import { useEffect } from 'react'

type Category = { id: string; name: string }

export function useCategories() {
  const query = useQuery<Category[], ApiError>({
    queryKey: ['categories'],
    queryFn: () => apiFetch<Category[]>('/api/typing/typingGet', undefined, { parseJson: true }),
    // v5 でも retry は残っている
    retry: (count, err) => !!err.status && err.status >= 500 && count < 2,
  })

  // エラーが起きたらトーストを出す副作用
  useEffect(() => {
    if (query.isError && query.error) {
      showError(`${query.error.message} (status ${query.error.status ?? '??'})`)
    }
  }, [query.isError, query.error])

  return query // 返り値は { data, isLoading, isError, ... }
}

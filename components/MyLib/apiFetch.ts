// components/MyLib/apiFetch.ts
import { ApiError } from './apiError'

type ApiFetchOptions = {
  withAuth?: boolean // default true
  timeoutMs?: number // default 15 000 ms
  parseJson?: boolean // default true – if false we return the raw Response
}

let refreshingPromise: Promise<string | null> | null = null

/**
 * apiFetch – your one‑stop replacement for window.fetch
 */
export async function apiFetch<T = any>(
  input: RequestInfo | URL,
  init: RequestInit = {},
  { withAuth = true, timeoutMs = 15_000, parseJson = false }: ApiFetchOptions = {}
): Promise<T> {
  /* ---------- build request ---------- */
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)

  const finalInit: RequestInit = {
    ...init,
    signal: ctrl.signal,
    credentials: 'include', // send cookies (refresh token) always
    headers: new Headers(init.headers || {}),
  }

  // Add API key from env to headers
  const apiKey = process.env.NEXT_PUBLIC_API_KEY
  if (apiKey) {
    ;(finalInit.headers as Headers).set('X-API-Key', apiKey)
  }

  if (withAuth) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
    if (token) (finalInit.headers as Headers).set('Authorization', `Bearer ${token}`)
  }

  /* ---------- send request ---------- */
  try {
    let res = await fetch(input, finalInit)

    /* ----- handle 401 (access token expired) ----- */
    if (withAuth && res.status === 401) {
      res = await retryAfterRefresh(input, finalInit)
    }

    /* ----- non‑200s still count as failures ----- */
    // if (!res.ok) throw new ApiError('Request failed', res.status, res)
    if (!res.ok) {
      let errorPayload: any = null
      try {
        const ct = res.headers.get('content-type') || ''
        if (ct.includes('application/json')) {
          errorPayload = await res.json()
        } else {
          errorPayload = await res.text()
        }
      } catch (_) {
        // 本文が空/読めない場合は無視
      }
      // ApiError のコンストラクタに body を渡せるなら渡す
      throw new ApiError(`Request failed: ${res.status} ${res.statusText}`, res.status, errorPayload || res)
    }

    return (parseJson ? await res.json() : res) as T
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new ApiError('Request timed out', 408)
    }
    if (err instanceof TypeError) {
      // Fetch throws TypeError for network failures / CORS etc.
      throw new ApiError('Network error or server unreachable', 503)
    }
    throw err
  } finally {
    clearTimeout(timer)
  }
}

/* ---------- helpers ---------- */
async function retryAfterRefresh(input: RequestInfo | URL, init: RequestInit): Promise<Response> {
  if (!refreshingPromise) refreshingPromise = refreshToken()
  const newToken = await refreshingPromise
  refreshingPromise = null

  if (!newToken) throw new ApiError('Session expired', 401)

  localStorage.setItem('accessToken', newToken)

  const retryInit = {
    ...init,
    headers: new Headers(init.headers),
  }
  ;(retryInit.headers as Headers).set('Authorization', `Bearer ${newToken}`)
  return fetch(input, retryInit)
}

async function refreshToken(): Promise<string | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/refresh`, {
    method: 'POST',
    credentials: 'include',
  })
  if (!res.ok) return null
  const { access_token } = await res.json()
  return access_token
}

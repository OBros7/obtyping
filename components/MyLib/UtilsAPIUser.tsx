// // --- obtyping/components/MyLib/UtilsAPIUser.tsx ---
let isRefreshing = false;

/**
 * fetchWithAuth
 *
 * - Attaches "Authorization: Bearer <token>" header if we have one.
 * - If the server responds with 401, it attempts to refresh the token.
 * - If refresh fails, it throws an error and we can log out.
 */
export async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
    init.headers = init.headers || {};

    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (accessToken) {
        (init.headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
    }

    // Always include credentials so the refresh cookie is sent if needed.
    init.credentials = 'include';

    let response = await fetch(input, init);

    // If we get a 401, try refreshing the token once.
    if (response.status === 401 && !isRefreshing) {
        console.log('response.status === 401... refreshing token...');
        isRefreshing = true;
        const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/refresh`, {
            method: 'POST',
            credentials: 'include',
        });
        if (refreshResponse.ok) {
            // Successfully refreshed
            console.log('Token refreshed successfully');
            const refreshData = await refreshResponse.json();
            // Save the new access token
            localStorage.setItem('accessToken', refreshData.access_token);
            isRefreshing = false;

            // Retry the original request with the new access token
            const retryInit: RequestInit = {
                ...init,
                headers: {
                    ...init.headers,
                    Authorization: `Bearer ${refreshData.access_token}`,
                },
            };
            response = await fetch(input, retryInit);
        } else {
            // Refresh token failed => log out
            console.error('Token refresh failed... logging out');
            localStorage.removeItem('accessToken');
            isRefreshing = false;
            throw new Error('Session has expired. Please log in again.');

        }
    }

    return response;
}


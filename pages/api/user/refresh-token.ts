import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) return res.status(401).json({ message: 'Unauthorized' });

        const response = await fetch(`${process.env.BACKEND_BASE_URL}/api/user/refresh-token`, {
            method: 'POST',
            headers: {
                'X-API-Key': process.env.BACKEND_API_KEY!,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!response.ok) {
            return res.status(response.status).json({ message: 'Failed to refresh tokens' });
        }

        const { access_token, refresh_token } = await response.json();

        // Set secure cookies
        res.setHeader('Set-Cookie', [
            `access_token=${access_token}; HttpOnly; Secure; SameSite=Strict; Path=/`,
            `refresh_token=${refresh_token}; HttpOnly; Secure; SameSite=Strict; Path=/`,
        ]);

        res.status(200).json({ message: 'Tokens refreshed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

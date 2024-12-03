import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';

const fastAPIURL = process.env.FASTAPI_URL 
const BACKEND_API_KEY = process.env.BACKEND_API_KEY

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { access_token } = req.cookies;

        if (!access_token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Proxy request to FastAPI backend
        const response = await axios.get(`${fastAPIURL}/api/user/check-auth`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                'X-API-Key': BACKEND_API_KEY,
            },
        });

        res.status(200).json(response.data);
    } catch (error: unknown) {
        // Handle Axios errors explicitly
        if (axios.isAxiosError(error)) {
            // Axios-specific error
            const status = error.response?.status || 500;
            const message = error.response?.data?.message || 'Authentication check failed';
            res.status(status).json({ message });
        } else {
            // Non-Axios error
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}

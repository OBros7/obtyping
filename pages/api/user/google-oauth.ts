import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // const loginURL = `${process.env.FASTAPI_URL}users/google-oauth-url`
        // res.redirect(loginURL);

        // const response = await fetch(`${process.env.FASTAPI_URL}users/google-oauth-url`, {
        //     method: "GET",
        //     credentials: 'include', // or 'same-origin' for same-origin requests
        // });
        // console.log('================================================')
        // console.log(response);
        // const { auth_url } = await response.json();
        // console.log('================================================')
        // console.log(auth_url);
        // res.redirect(auth_url);

        // window.location.href = auth_url;

        // const backendOauthUrl = `${process.env.FASTAPI_URL}users/google-oauth`;

        // // Initiate OAuth flow with the backend
        // const response = await fetch(backendOauthUrl, {
        //     method: 'GET',
        //     headers: {
        //         'X-API-Key': process.env.BACKEND_API_KEY!,
        //         'Content-Type': 'application/json',
        //     },
        //     credentials: 'include', // Include cookies
        //     redirect: 'manual', // Prevent automatic redirect
        // });

        // if (response.status !== 302) {
        //     console.error('Unexpected response from backend:', response);
        //     return res.status(response.status).json({ message: 'Failed to initiate OAuth flow' });
        // }

        // // Extract the redirect URL from the "Location" header
        // const redirectUrl = response.headers.get('location');
        // if (!redirectUrl) {
        //     console.error('Redirect URL missing from response headers');
        //     return res.status(500).json({ message: 'Redirect URL missing from response' });
        // }

        // // Redirect the client to the Google OAuth URL
        // res.redirect(redirectUrl);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error: NextJS' });
    }
}

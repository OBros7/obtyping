// pages/api/typing/typingGet.ts
// //https://chatgpt.com/c/671cb60d-85b8-8000-9b0b-74d2f35f6167

import type { NextApiRequest, NextApiResponse } from 'next';

// Access environment variables on the server side
const fastAPIURL = process.env.FASTAPI_URL + 'typing/';
const BACKEND_API_KEY = process.env.BACKEND_API_KEY;

// Helper function to create query strings from an object
const createQueryString = (data: Record<string, any>) => {
  return Object.keys(data)
    .filter((key) => data[key] !== undefined)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');
};

// Main API handler function with properly typed parameters
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { endpoint, data, method = 'GET' } = req.body;
  const url = `${fastAPIURL}${endpoint}`;

//   console.log('Server-side BACKEND_API_KEY:', BACKEND_API_KEY); // Verify it logs in terminal

  // Create the query string if it's a GET request
  const queryString = createQueryString(data);
  const fullUrl = method === 'GET' ? `${url}?${queryString}` : url;

  // Set up options for the fetch request
  const options: RequestInit = {
    method,
    headers: {
      'X-API-Key': BACKEND_API_KEY || '',
      'Content-Type': 'application/json',
    },
  };

  // If POST request, include the data in the body
  if (method === 'POST') {
    options.body = JSON.stringify(data);
  }

  // Execute fetch request and handle errors
  try {
    const response = await fetch(fullUrl, options);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const json = await response.json();
    res.status(200).json(json);
  } catch (error) {
    const err = error as Error;
    console.error('Error fetching data:', err.message);
    res.status(500).json({ error: err.message });
  }
}



// // Helper function to create query strings from an object
// const createQueryString = (data: Record<string, any>) => {
//   return Object.keys(data)
//     .filter((key) => data[key] !== undefined)
//     .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
//     .join('&');
// };

// // Main API fetch function
// export const fetchFromBackend = async (
//   endpoint: string,
//   data: Record<string, any> = {},
//   method: 'GET' | 'POST' = 'GET'
// ) => {
//     const fastAPIURL = process.env.FASTAPI_URL + 'typing/';
//     const BACKEND_API_KEY = process.env.BACKEND_API_KEY;
//     const url = `${fastAPIURL}${endpoint}`;
//     console.log('url:', url);
//     console.log('backend api key:', BACKEND_API_KEY);
//     console.log('Environment variables:', process.env);

//     // Create the query string if it's a GET request
//     const queryString = createQueryString(data);
//     const fullUrl = method === 'GET' ? `${url}?${queryString}` : url;

//     // Options for the fetch request
//     const options: RequestInit = {
//         method,
//         headers: {
//         'X-API-Key': BACKEND_API_KEY || '',
//         'Content-Type': 'application/json',
//         },
//     };

//     // If POST request, include the data in the body
//     if (method === 'POST') {
//         options.body = JSON.stringify(data);
//     }

//     // Execute fetch request and handle errors
//     try {
//         const response = await fetch(fullUrl, options);
//         if (!response.ok) {
//         throw new Error(`Error ${response.status}: ${response.statusText}`);
//         }
//         return await response.json();
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         throw error;
//     }
// };

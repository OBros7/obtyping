// pages/api/typing/typingGet.ts
// //https://chatgpt.com/c/671cb60d-85b8-8000-9b0b-74d2f35f6167

import type { NextApiRequest, NextApiResponse } from 'next'
import { createQueryString } from '../utils'

// Access environment variables on the server side
const fastAPIURL = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/typing/'
const BACKEND_API_KEY = process.env.BACKEND_API_KEY

// Main API handler function with properly typed parameters
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { endpoint, data, method = 'GET' } = req.body
  console.log('Received endpoint:', endpoint)
  console.log('Received data:', data)
  const url = `${fastAPIURL}${endpoint}`

  //   console.log('Server-side BACKEND_API_KEY:', BACKEND_API_KEY); // Verify it logs in terminal

  // Create the query string if it's a GET request
  const queryString = createQueryString(data) // ここで生成されるクエリがFastAPI側で期待するものと一致するように注意
  const fullUrl = method === 'GET' ? `${url}?${queryString}` : url

  // Set up options for the fetch request
  const options: RequestInit = {
    method,
    headers: {
      'X-API-Key': BACKEND_API_KEY || '',
      'Content-Type': 'application/json',
    },
  }

  // If POST request, include the data in the body
  if (method === 'POST') {
    options.body = JSON.stringify(data)
  }

  // Execute fetch request and handle errors
  try {
    console.log('Requesting URL:', fullUrl)
    const response = await fetch(fullUrl, options)
    console.log('FastAPI Response Status:', response.status)
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }
    const json = await response.json()
    res.status(200).json(json)
  } catch (error) {
    const err = error as Error
    console.error('Error fetching data:', err.message)
    res.status(500).json({ error: err.message })
  }
}

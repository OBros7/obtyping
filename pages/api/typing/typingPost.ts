// pages/api/typing/typingPost.ts
import type { NextApiRequest, NextApiResponse } from 'next'

// Access environment variables on the server side
const fastAPIURL = process.env.FASTAPI_URL + 'typing/'
const BACKEND_API_KEY = process.env.BACKEND_API_KEY

// Main API handler function with properly typed parameters
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { endpoint, data } = req.body
  const url = `${fastAPIURL}${endpoint}`

  // Set up options for the fetch request
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'X-API-Key': BACKEND_API_KEY || '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }

  // Execute fetch request and handle errors
  try {
    console.log('TypingUrl:', url)
    console.log('TypingPostProcess')
    const response = await fetch(url, options)
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

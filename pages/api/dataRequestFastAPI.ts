// pages/api/typing/typingGet.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { createQueryString } from './utils'

// Access environment variables on the server side
const fastAPIURL = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/typing/'
const BACKEND_API_KEY = process.env.BACKEND_API_KEY

// Main API handler function with properly typed parameters
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { endpoint, data, method } = req.body
  const url = `${fastAPIURL}${endpoint}`

  // Create the query string if it's a GET request
  const queryString = data ? createQueryString(data) : '' // dataがある場合のみクエリを作成
  // const queryString = createQueryString(data) // ここで生成されるクエリがFastAPI側で期待するものと一致するように注意
  const fullUrl = method === 'GET' ? `${url}?${queryString}` : url

  // Set up options for the fetch request
  const options: RequestInit = {
    method,
    headers: {
      'X-API-Key': BACKEND_API_KEY || '',
      'Content-Type': 'application/json',
    },
  }
  if (method === 'POST') {
    options.body = JSON.stringify(data)
  }

  try {
    const response = await fetch(fullUrl, options)
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

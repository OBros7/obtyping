// pages/api/Record/recordPost.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { PostRecordTime } from '@/MyLib/UtilsAPIRecord'

const fastAPIURL = process.env.FASTAPI_URL + 'typing/'
const BACKEND_API_KEY = process.env.BACKEND_API_KEY || ''

const recordPost = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const { endpoint, data, method = 'POST' } = req.body
  const url = `${fastAPIURL}${endpoint}`

  if (!data || !data.user_id || !data.deck_id || !data.score || !data.wpm || !data.cpm || !data.accuracy) {
    return res.status(400).json({ error: 'Missing required fields in request body' })
  }

  // Set up options for the fetch request
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'X-API-Key': BACKEND_API_KEY || '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }
  // If GET request, include the data in the body
  if (method === 'GET') {
    options.body = JSON.stringify(data)
  }

  try {
    console.log('recordPostProcess')
    console.log('data:', data)
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-API-Key': BACKEND_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to post record to FastAPI' })
    }

    const responseData = await response.json()
    return res.status(200).json(responseData)
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export default recordPost

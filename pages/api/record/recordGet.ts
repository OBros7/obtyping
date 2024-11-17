// pages/api/Record/recordGet.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { createQueryString } from '../utils'

const fastAPIURL = process.env.FASTAPI_URL + 'typing/'
const BACKEND_API_KEY = process.env.BACKEND_API_KEY || ''

interface GetRecordQuery {
  user_id: string
  deck_id: string
}

const recordGet = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const { user_id, deck_id } = req.query as Partial<GetRecordQuery>

  if (!user_id || !deck_id) {
    return res.status(400).json({ error: 'Missing required query parameters: user_id or deck_id' })
  }

  const { endpoint, data, method = 'GET' } = req.body

  const url = `${fastAPIURL}${endpoint}`
  const queryString = createQueryString(data)
  const fullUrl = method === 'GET' ? `${url}?${queryString}` : url

  // const endpoint = `get_record/?user_id=${user_id}&deck_id=${deck_id}`
  // const url = fastAPIURL + endpoint
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
    console.log('recordGetProcess')
    const response = await fetch(fullUrl, options)

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch record from FastAPI' })
    }

    const data = await response.json()
    return res.status(200).json(data)
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export default recordGet

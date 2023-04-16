import type { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const response = await fetch('http://localhost:8000/charge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    })

    const data = await response.json()
    res.status(response.status).json(data)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default handler

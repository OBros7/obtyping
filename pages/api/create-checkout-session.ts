import type { NextApiRequest, NextApiResponse } from 'next'

const url = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/create-checkout-session'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { user_id } = req.body
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id }),
    })

    const data = await response.json()
    res.status(response.status).json(data)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default handler

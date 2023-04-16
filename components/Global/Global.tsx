import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { GlobalContext } from 'context/GlobalContext'

const urlUsers = process.env.FASTAPI_URL + '/users/'

export default function Global({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [userID, setUserID] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState('');

  console.log('fastAPI url:', process.env.FASTAPI_URL)
  console.log('userID:', userID)

  async function fetchPaymentStatus(userID: string | null) {
    const urlPayment = process.env.FASTAPI_URL + `/user-payment-status/${userID}`
    try {
      const response = await fetch(urlPayment);
      if (response.ok) {
        const data = await response.json();
        setPaymentStatus(data.payment_status);
      } else {
        console.error('Failed to fetch payment status');
      }
    } catch (error) {
      console.error('Error fetching payment status:', error);
    }
  }

  useEffect(() => {
    if (session?.user) {
      const data = {
        email: session?.user.email,
        username: session?.user.name,
      }
      fetch(urlUsers, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error(`Failed to fetch user with status ${res.status}`);
          }
        })
        .then((data) => {
          setUserID(data.id);
          fetchPaymentStatus(data.id);
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
        });
    }
  }, [session]);

  return <GlobalContext.Provider value={{ session, userID, paymentStatus }}>{children}</GlobalContext.Provider>
}

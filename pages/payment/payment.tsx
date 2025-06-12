import React from 'react'
import { PaymentStatus } from '@/Payment'

// get APP_ENV from .env.local
const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV || 'prod';

export default function payment() {
    return (
        APP_ENV === 'prod' ? <p>Payment page is not available.</p> : <PaymentStatus />
    )
}

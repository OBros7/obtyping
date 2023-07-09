import React from 'react'
import { PaymentButton } from './'


export default function PaymentStatus() {
    return (
        <div>
            <p>
                Show plan here
            </p>
            <p>
                Free plan:
            </p>
            <p>
                Premium plan:
                <PaymentButton priceId='price_1N2WYQCax4QHVExa4XA9VX71' text="Go to Payment Page" />
            </p>
        </div>
    )
}

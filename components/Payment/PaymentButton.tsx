import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

interface PaymentButtonProps {
    priceId: string;
    text: string;
    className?: string;
}

const url = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/stripe/create_checkout_session'
const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';


export default function PaymentButton({ priceId, text, className = 'btn-primary' }: PaymentButtonProps) {
    const [loading, setLoading] = useState(false);

    const redirectToCheckout = async () => {
        setLoading(true);

        const stripe = await loadStripe(STRIPE_PUBLIC_KEY);
        if (!stripe) {
            setLoading(false);
            return;
        }

        const data = {// rewrite data to match the backend
            // user_id: userID
            price_id: priceId
        }

        const response = await fetch(`${url}?price_id=${encodeURIComponent(priceId)}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });


        if (response.ok) {
            const session = await response.json();
            const { error } = await stripe.redirectToCheckout({
                sessionId: session.id,
            });

            if (error) {
                console.error("Error redirecting to checkout:", error.message);
            }
        } else {
            console.error("Error creating checkout session:", await response.text());
        }

        setLoading(false);
    };


    return (
        <button onClick={redirectToCheckout} disabled={loading} className={className}>
            {loading ? "Loading..." : text}
        </button>
    );
};



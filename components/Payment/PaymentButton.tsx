// --- components/Payment/PaymentButton.tsx ---
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
// import { fetchWithAuth } from '@/MyLib/UtilsAPIUser';
import { apiFetch } from '@/MyLib/apiFetch';

interface PaymentButtonProps {
    /** The Stripe Price-ID of the plan the user is buying */
    priceId: string;
    text: string;
    className?: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;
const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

export default function PaymentButton({
    priceId,
    text,
    className = 'btn-primary',
}: PaymentButtonProps) {
    const [loading, setLoading] = useState(false);

    const redirectToCheckout = async () => {
        setLoading(true);

        const stripe = await loadStripe(STRIPE_PUBLIC_KEY);
        if (!stripe) {
            console.error('Stripe not initialised');
            setLoading(false);
            return;
        }

        // 1️⃣ Call your FastAPI endpoint *with auth*
        const res = await apiFetch(
            `${BACKEND_URL}/api/stripe/create-checkout-session`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ price_id: priceId }),
            },
            { parseJson: false } // We handle the response manually
        );

        if (!res.ok) {
            console.error('Checkout session error', await res.text());
            setLoading(false);
            return;
        }

        // 2️⃣ FastAPI returns { checkout_url }
        const { checkout_url } = (await res.json()) as { checkout_url: string };
        window.location.href = checkout_url; // client-side redirect

        // No need to call stripe.redirectToCheckout because FastAPI already
        // gives us the hosted URL.
    };

    return (
        <button onClick={redirectToCheckout} disabled={loading} className={className}>
            {loading ? 'Redirecting…' : text}
        </button>
    );
}

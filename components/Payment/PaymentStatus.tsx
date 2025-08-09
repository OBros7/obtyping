// --- components/Payment/PaymentStatus.tsx ---
import { useEffect, useState } from 'react';
// import { fetchWithAuth } from '@/MyLib/UtilsAPIUser';
// import { apiFetch } from '@/MyLib/apiFetch';
import useAuth from '@/MyCustomHooks/useAuth';
import PaymentButton from './PaymentButton';
import ManagePortalButton from './ManagePortalButton';
import { set } from 'react-hook-form';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;
const PRICE_ID_PREMIUM = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM!;

export default function PaymentStatus() {
    const [loading, setLoading] = useState(true);
    const [isPaid, setIsPaid] = useState<boolean | null>(null);
    const { refreshUserSession } = useAuth();

    useEffect(() => {
        (async () => {
            try {
                await refreshUserSession();
                // get userData from localStorage
                const userData = localStorage.getItem('userData');
                setIsPaid(userData ? JSON.parse(userData).subscriptionStatus : false);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <p>Checking subscription…</p>;

    if (isPaid) {
        return (
            <div className="space-y-4">
                <p>You are on the <b>Premium</b> plan 🎉</p>
                <ManagePortalButton />
                <button
                    onClick={() => window.location.href = '/'}
                    className="btn-second"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <p>Current plan: <b>Free</b></p>
            <PaymentButton priceId={PRICE_ID_PREMIUM} text="Upgrade to Premium →" />
        </div>
    );
}

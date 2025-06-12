// --- components/Payment/PaymentStatus.tsx ---
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/MyLib/UtilsAPIUser';
import PaymentButton from './PaymentButton';
import ManagePortalButton from './ManagePortalButton';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;
const PRICE_ID_PREMIUM = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM!;

export default function PaymentStatus() {
    const [loading, setLoading] = useState(true);
    const [isPaid, setIsPaid] = useState<boolean | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetchWithAuth(`${BACKEND_URL}/api/user/session`);
                if (res.ok) {
                    const data = await res.json();
                    setIsPaid(data.user?.is_paid_user);
                } else {
                    setIsPaid(false);
                }
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

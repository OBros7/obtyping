// --- components/Payment/PaymentStatus.tsx ---
import { useEffect, useRef, useState, useCallback } from 'react';
import useAuth from '@/MyCustomHooks/useAuth';
import PaymentButton from './PaymentButton';
import ManagePortalButton from './ManagePortalButton';

const PRICE_ID_PREMIUM = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM!;

export default function PaymentStatus() {
    const [loading, setLoading] = useState(true);
    const [isPaid, setIsPaid] = useState<boolean | null>(null);
    const { refreshUserSession } = useAuth();
    const ranRef = useRef(false); // 初回実行フラグ

    const readIsPaidFromStorage = useCallback((): boolean => {
        try {
            if (typeof window === 'undefined') return false;
            const raw = window.localStorage.getItem('userData');
            if (!raw) return false;
            const parsed = JSON.parse(raw);
            return Boolean(parsed?.subscriptionStatus);
        } catch {
            return false;
        }
    }, []);

    useEffect(() => {
        if (ranRef.current) return; // 依存が変わっても初回だけ実行
        ranRef.current = true;

        (async () => {
            try {
                await refreshUserSession();
                setIsPaid(readIsPaidFromStorage());
            } finally {
                setLoading(false);
            }
        })();
    }, [refreshUserSession, readIsPaidFromStorage]);

    // 他タブでの購読状態変更に追従（任意だが便利）
    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key === 'userData') setIsPaid(readIsPaidFromStorage());
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, [readIsPaidFromStorage]);

    if (loading) return <p>Checking subscription…</p>;

    if (isPaid) {
        return (
            <div className="space-y-4">
                <p>You are on the <b>Premium</b> plan 🎉</p>
                <ManagePortalButton />
                <button
                    onClick={() => (window.location.href = '/')}
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

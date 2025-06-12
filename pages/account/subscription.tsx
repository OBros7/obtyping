// --- pages/account/subscription.tsx ---
import { useRouter } from 'next/router';
import PaymentStatus from '@/Payment/PaymentStatus';

export default function SubscriptionPage() {
    const router = useRouter();
    const { status } = router.query;   // "success" | "cancel" | undefined

    return (
        <main className="max-w-2xl mx-auto p-6">
            {status === 'success' && (
                <p className="text-green-600 mb-4">✅ Payment successful! Welcome to Premium.</p>
            )}
            {status === 'cancel' && (
                <p className="text-red-600 mb-4">❌ Payment cancelled.</p>
            )}

            {/* Always show current status so user can act again */}
            <PaymentStatus />
        </main>
    );
}

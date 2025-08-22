// --- components/Payment/ManagePortalButton.tsx ---
import { useState } from 'react';
// import { fetchWithAuth } from '@/MyLib/UtilsAPIUser';
import { apiFetch } from '@/MyLib/apiFetch';

interface Props {
    className?: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export default function ManagePortalButton({ className = 'btn-primary' }: Props) {
    const [loading, setLoading] = useState(false);

    const openPortal = async () => {
        setLoading(true);
        const res = await apiFetch(`${BACKEND_URL}/api/stripe/create-portal-session`, {
            method: 'POST',
        }, { parseJson: true });
        if (res.ok) {
            const { portal_url } = res;
            window.location.href = portal_url;
        } else {
            console.error('Unable to open billing portal', await res.text());
        }
        setLoading(false);
    };

    return (
        <button onClick={openPortal} disabled={loading} className={className}>
            {loading ? 'Opening…' : 'Manage subscription'}
        </button>
    );
}

// --- obtyping/components/Account/OAuthCallback.tsx（全置換） ---
import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuth from '@/MyCustomHooks/useAuth';

const OAuthCallback = () => {
    const { refreshUserSession } = useAuth();

    useEffect(() => {
        (async () => {
            try {
                await refreshUserSession(); // /session -> 401 -> /refresh -> OK
                window.location.href = '/';
            } catch (_) {
                // 失敗時はサインインに戻すなどお好みで
                window.location.href = '/account/signin';
            }
        })();
    }, [refreshUserSession]);

    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-primary-600 text-white">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            >
                <Loader2 size={48} className="animate-spin" />
            </motion.div>
            <p className="mt-4 text-lg">サインインしています…</p>
        </div>
    );
};

export default OAuthCallback;

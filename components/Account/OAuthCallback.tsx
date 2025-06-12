// --- obtyping/components/Account/OAuthCallback.tsx ---
import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';          // アイコンライブラリ
import { motion } from 'framer-motion';          // 簡単な呼吸アニメーション用
import { useRouter } from 'next/router';
import useAuth from '@/MyCustomHooks/useAuth';

const OAuthCallback = () => {
    const { refreshUserSession } = useAuth();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const cookies = document.cookie.split(';');
            // debug
            console.log('OAuthCallback cookies:', cookies);
            const tokenCookie = cookies.find(c => c.trim().startsWith('access_token='));
            if (tokenCookie) {
                const localAccessToken = tokenCookie.split('=')[1];
                document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
                (async () => {
                    try {
                        await refreshUserSession();
                        window.location.href = '/'; // or router.push('/')
                    } catch (err) {
                    }
                })();
            } else {
            }
        }

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

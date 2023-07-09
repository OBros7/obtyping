// hooks/useAuth.tsx
import { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { useRouter } from 'next/router';

// this should be the same as the interface in the backend (see app/User/utils.py: create_access_token)
interface DecodedUser {
    user_id: number;
    user_name?: string;
    is_paid_user?: boolean;
    exp?: number;
    iat?: number;
}

const useAuth = () => {

    const [user, setUser] = useState<DecodedUser | null>(null);
    const router = useRouter();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedUser = jwt_decode(token) as DecodedUser; // Cast decoded user to DecodedUser type
                setUser(decodedUser);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    const [signedOut, setSignedOut] = useState(false);

    const signOut = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/');
        setSignedOut(true);
    };

    useEffect(() => {
        setSignedOut(false);
    }, [user]);

    return { user, signOut, signedOut, setSignedOut };
};

export default useAuth;

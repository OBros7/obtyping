import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';

interface DecodedToken {
    [key: string]: any;
}

export default function useUserFromCookie() {
    const [user, setUser] = useState<DecodedToken | null>(null)// if this causes error, set any

    useEffect(() => {
        const token = Cookies.get('access_token');

        if (token) {
            const decodedToken = jwt_decode(token) as DecodedToken;
            setUser(decodedToken);
        }
    }, []);

    return user;
};

// --- obtyping/contexts/UserContext.tsx ---
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserData {
    userID: string;
    userName: string;
    loginStatus: boolean;
    subscriptionStatus: boolean;
    expToken: string;
    iatToken: string;
}

export interface UserContextType {
    userData: UserData;
    setUserData: (data: UserData) => void;
}

const defaultUserData: UserData = {
    userID: '',
    userName: '',
    loginStatus: false,
    subscriptionStatus: false,
    expToken: '',
    iatToken: '',
};

const UserContext = createContext<UserContextType>({
    userData: defaultUserData,
    setUserData: () => { },
});

export const useUserContext = () => useContext(UserContext);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [userData, setUserDataState] = useState<UserData>(defaultUserData);

    // 1) On mount, read from localStorage if available
    useEffect(() => {
        try {
            const stored = localStorage.getItem('userData');
            if (stored) {
                const parsed = JSON.parse(stored) as UserData;
                setUserDataState(parsed);
            }
        } catch (error) {
            console.error('Error parsing userData from localStorage', error);
        }
    }, []);

    // 2) Provide a function that updates both context and localStorage
    const setUserData = (data: UserData) => {
        setUserDataState(data);
        localStorage.setItem('userData', JSON.stringify(data));
    };

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserContext.Provider>
    );
};

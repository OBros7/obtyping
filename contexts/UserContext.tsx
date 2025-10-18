// --- obtyping/contexts/UserContext.tsx ---
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
    useMemo,
} from 'react';

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

/** 浅い比較（同値なら再レンダーを避ける） */
function shallowEqual(a: UserData, b: UserData) {
    return (
        a.userID === b.userID &&
        a.userName === b.userName &&
        a.loginStatus === b.loginStatus &&
        a.subscriptionStatus === b.subscriptionStatus &&
        a.expToken === b.expToken &&
        a.iatToken === b.iatToken
    );
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

    // 2) 安定した setter（同値なら状態更新しない & localStorage も書き換えない）
    const setUserData = useCallback((data: UserData) => {
        setUserDataState(prev => {
            if (shallowEqual(prev, data)) {
                return prev;
            }
            try {
                localStorage.setItem('userData', JSON.stringify(data));
            } catch { }
            return data;
        });
    }, []);

    // 3) Provider value も安定化
    const value = useMemo(() => ({ userData, setUserData }), [userData, setUserData]);

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

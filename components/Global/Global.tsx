// components/Global/Global.tsx

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
  setUserData: (userData: UserData) => void;
}

const defaultState = {
  userData: {
    userID: '',
    userName: '',
    loginStatus: false,
    subscriptionStatus: false,
    expToken: '',
    iatToken: '',
  },
  setUserData: () => { },
};

const UserContext = createContext<UserContextType>(defaultState);

export const useUserContext = () => useContext(UserContext);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>(defaultState.userData);

  useEffect(() => {
    const userID = localStorage.getItem('userID') || '';
    const userName = localStorage.getItem('userName') || '';
    const loginStatus = localStorage.getItem('loginStatus') === 'true';
    const subscriptionStatus = localStorage.getItem('subscriptionStatus') === 'true';
    const expToken = localStorage.getItem('expToken') || '';
    const iatToken = localStorage.getItem('iatToken') || '';

    setUserData({
      userID,
      userName,
      loginStatus,
      subscriptionStatus,
      expToken,
      iatToken,
    });
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;


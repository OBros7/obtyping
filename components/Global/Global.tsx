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
// import React, { useEffect, useState } from 'react';
// import { useSession } from 'next-auth/react';
// import { GlobalContext } from 'context/GlobalContext';

// const urlUsers = process.env.FASTAPI_URL + 'users/';

// // this code is suggested by ChatGPT. If it doesn't work, try the code below

// async function fetchUser(session: any) {
//   const data = {
//     email: session?.user.email,
//     username: session?.user.name,
//   };
//   try {
//     const response = await fetch(urlUsers, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     });

//     if (response.ok) {
//       return await response.json();
//     } else {
//       throw new Error(`Failed to fetch user with status ${response.status}`);
//     }
//   } catch (error) {
//     console.error('Error fetching user:', error);
//   }
// }

// async function fetchPaymentStatus(userID: string | null) {
//   const urlPayment = process.env.FASTAPI_URL + `/user-payment-status/${userID}`;
//   try {
//     const response = await fetch(urlPayment);
//     if (response.ok) {
//       const data = await response.json();
//       return data.payment_status;
//     } else {
//       console.error('Failed to fetch payment status');
//     }
//   } catch (error) {
//     console.error('Error fetching payment status:', error);
//   }
// }

// export default function Global({ children }: { children: React.ReactNode }) {
//   const { data: session } = useSession();
//   const [userID, setUserID] = useState<string | null>(null);
//   const [paymentStatus, setPaymentStatus] = useState('');

//   useEffect(() => {
//     (async () => {
//       if (session?.user) {
//         const userData = await fetchUser(session);
//         if (userData) {
//           setUserID(userData.id);
//           const paymentStatusData = await fetchPaymentStatus(userData.id);
//           if (paymentStatusData) {
//             setPaymentStatus(paymentStatusData);
//           }
//         }
//       }
//     })();
//   }, [session]);

//   return (
//     <GlobalContext.Provider value={{ session, userID, paymentStatus }}>
//       {children}
//     </GlobalContext.Provider>
//   );
// }

// import React, { useEffect, useState } from 'react'
// import { useSession } from 'next-auth/react'
// import { GlobalContext } from 'context/GlobalContext'

// const urlUsers = process.env.FASTAPI_URL + 'users/'

// export default function Global({ children }: { children: React.ReactNode }) {
//   const { data: session } = useSession()
//   const [userID, setUserID] = useState<string | null>(null)
//   const [paymentStatus, setPaymentStatus] = useState('');

//   console.log('fastAPI url:', process.env.FASTAPI_URL)
//   console.log('userID:', userID)

//   async function fetchPaymentStatus(userID: string | null) {
//     const urlPayment = process.env.FASTAPI_URL + `/user-payment-status/${userID}`
//     try {
//       const response = await fetch(urlPayment);
//       if (response.ok) {
//         const data = await response.json();
//         setPaymentStatus(data.payment_status);
//       } else {
//         console.error('Failed to fetch payment status');
//       }
//     } catch (error) {
//       console.error('Error fetching payment status:', error);
//     }
//   }

//   useEffect(() => {
//     if (session?.user) {
//       const data = {
//         email: session?.user.email,
//         username: session?.user.name,
//       }
//       fetch(urlUsers, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       })
//         .then((res) => {
//           if (res.ok) {
//             return res.json();
//           } else {
//             throw new Error(`Failed to fetch user with status ${res.status}`);
//           }
//         })
//         .then((data) => {
//           setUserID(data.id);
//           fetchPaymentStatus(data.id);
//         })
//         .catch((error) => {
//           console.error('Error fetching user:', error);
//         });
//     }
//   }, [session]);

//   return <GlobalContext.Provider value={{ session, userID, paymentStatus }}>{children}</GlobalContext.Provider>
// }

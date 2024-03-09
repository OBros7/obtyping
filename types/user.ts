export interface UserData {
  userID: string
  userName: string
  loginStatus: boolean
  subscriptionStatus: boolean
  expToken: string
  iatToken: string
}

export interface UserContextType {
  userData: UserData
  setUserData: (userData: UserData) => void
}

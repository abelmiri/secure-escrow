export interface UserType {
  first_name: string
  last_name: string
  mobile_number: string
  email: string
  username: string
  national_code: string | null
  avatar: string | null
  position_title: string | null
}

export interface UpdateUserType
  extends Omit<UserType, "avatar" | "mobile_number" | "username" | "email"> {
  avatar: File | string
}

export interface LoginType {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface AuthStateType {
  isLoading: boolean
  user: null | UserType
}

export interface SetUserActionType {
  type: "SET_USER"
  payload: { user: UserType }
}

export interface ResetDataActionType {
  type: "RESET_DATA"
  payload: { isAfterLogin: boolean }
}

export interface SetGettingUserActionType {
  type: "SET_GETTING_USER"
  payload: { isLoading: boolean }
}

export type AuthActionType =
  | SetUserActionType
  | ResetDataActionType
  | SetGettingUserActionType

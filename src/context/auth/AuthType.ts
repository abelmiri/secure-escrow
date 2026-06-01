export interface UserType {
  first_name: string
  last_name: string
  mobile_number: string
  email: string
  email_verified: boolean
  username: string
  national_code: string | null
  national_code_verified: boolean
  image: string | null
  shaba_number: string | null
  shaba_number_verified: boolean
  identity_verified: boolean
  city: string | null
  province: string | null
  postal_code: string | null
  full_address: string | null
}

export interface UpdateUserType extends Omit<
  UserType,
  "image" | "mobile_number" | "username" | "email_verified" | "national_code_verified" | "shaba_number_verified" | "identity_verified"
> {
  image: File | string | null
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

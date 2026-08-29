export interface RepresentedPartnerType {
  id: string | number
  name: string
}

export interface PartnerProfileMemberType {
  first_name?: string
  last_name?: string
  national_code?: string
  mobile_number?: string
}

export interface PartnerProfileType {
  id: number
  actor_id: string
  name: string
  registered_name: string
  id_number: string
  economic_number: string
  registration_number: string
  image: string | null
  phone_number: string
  email: string
  shaba_number: string
  city: number
  province: number
  postal_code: string
  full_address: string | null
  members: PartnerProfileMemberType[]
  is_active: boolean
  is_profile_complete: boolean
  are_documents_sent: boolean
  is_allowed_as_broker: boolean
}

export interface UserType {
  id?: string | number
  actor_id: string | number
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
  city: string | number | null
  province: string | number | null
  postal_code: string | null
  full_address: string | null
  represented_partners?: RepresentedPartnerType[]
}

export interface UpdateUserType extends Omit<
  UserType,
  | "actor_id"
  | "image"
  | "mobile_number"
  | "username"
  | "email_verified"
  | "national_code_verified"
  | "shaba_number_verified"
  | "identity_verified"
> {
  image: File | string | null
}

export interface LoginType {
  access_token: string
  refresh_token: string
  id_token?: string
  token_type: string
  expires_in: number
}

export interface AuthStateType {
  isLoading: boolean
  user: null | UserType
  partnerProfiles: PartnerProfileType[]
}

export interface SetUserActionType {
  type: "SET_USER"
  payload: { user: UserType }
}

export interface SetPartnerProfilesActionType {
  type: "SET_PARTNER_PROFILES"
  payload: { partnerProfiles: PartnerProfileType[] }
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
  | SetPartnerProfilesActionType
  | ResetDataActionType
  | SetGettingUserActionType

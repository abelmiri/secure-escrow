import resetDataManager from "@/helpers/storage/resetDataManager"
import loginOAUTH from "@/helpers/auth/loginOAUTH"

/**
 * Handles 401 Unauthorized errors by clearing user data and redirecting to login.
 */
export default function handleUnauthorized() {
  if (typeof window !== "undefined") {
    // Clear data from context and storage
    resetDataManager.resetData({ isAfterLogin: false })
    
    // Redirect to login page
    loginOAUTH({ redirect: true })
  }
}

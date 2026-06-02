import resetDataManager from "@/helpers/storage/resetDataManager"
import loginOAUTH from "@/helpers/auth/loginOAUTH"

/**
 * Handles 401 Unauthorized or 403 Forbidden errors by clearing user data and redirecting to home.
 */
export default function handleUnauthorized() {
  if (typeof window !== "undefined") {
    // Clear data from context and storage
    resetDataManager.resetData({ isAfterLogin: false }).then(() => {
      // Redirect to home page
      window.location.replace("/")
    })
  }
}

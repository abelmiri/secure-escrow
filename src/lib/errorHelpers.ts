export function getErrorMessage({
  status,
  data,
}: {
  status?: number
  data?: unknown
}): string {
  if (data && typeof data === "string") return data
  if (data && typeof data === "object") {
    if ("message" in data && typeof data.message === "string") {
      return data.message
    }
    if ("error" in data && typeof data.error === "string") {
      return data.error
    }
  }

  if (status === 404) return "منبع مورد نظر یافت نشد"
  if (status === 500) return "خطای داخلی سرور"
  if (status === 403) return "دسترسی امکان‌پذیر نیست"
  if (status === 401) return "عدم احراز هویت"

  return "خطای غیرمنتظره‌ای رخ داده است"
}

export const toastConstant = {
  networkError: "خطای شبکه. لطفا اتصال خود را بررسی کنید.",
}

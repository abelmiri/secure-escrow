import useSWR from "swr"
import request from "@/request/request"
import API_URLS from "@/constants/urls/API_URLS"

export interface SubCategory {
  id: number
  name: string
  slug: string
  description?: string | null
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  sub_categories: SubCategory[]
}

function normalizeCategories(data: unknown): Category[] {
  if (Array.isArray(data)) return data as Category[]

  if (data && typeof data === "object" && "collection" in data) {
    const collection = (data as { collection?: unknown }).collection
    if (Array.isArray(collection)) return collection as Category[]
  }

  return []
}

export function useCategories() {
  const { data, error, isLoading } = useSWR(API_URLS.categories, (url) =>
    request.get({ url }),
  )

  return { categories: normalizeCategories(data), isLoading, error }
}

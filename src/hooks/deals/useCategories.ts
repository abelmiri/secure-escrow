import { useEffect, useState } from "react"
import request from "@/request/request"
import API_URLS from "@/constants/urls/API_URLS"

export interface SubCategory {
  id: number
  name: string
  slug: string
  description?: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string
  sub_categories: SubCategory[]
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    setIsLoading(true)
    request
      .get({ url: API_URLS.categories })
      .then((data) => {
        setCategories(data)
        setError(null)
      })
      .catch((err) => {
        setError(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return { categories, isLoading, error }
}

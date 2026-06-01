import { useEffect, useState } from "react"
import request from "@/request/request"
import API_URLS from "@/constants/urls/API_URLS"

export interface SubCategory {
  id: number
  name: string
  slug: string
}

export function useSubCategories(categoryId: number | null) {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    if (categoryId === null) {
      setSubCategories([])
      return
    }

    setIsLoading(true)
    request
      .get({ url: API_URLS.subCategories({ id: categoryId }) })
      .then((data) => {
        setSubCategories(data)
        setError(null)
      })
      .catch((err) => {
        setError(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [categoryId])

  return { subCategories, isLoading, error }
}

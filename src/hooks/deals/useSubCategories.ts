import { useEffect, useState } from "react"
import request from "@/request/request"
import API_URLS from "@/constants/urls/API_URLS"

export interface PropertyOption {
  value: string
  label: string
}

export interface Property {
  name: string
  property_name: string
  slug: string
  field_type:
    | "string"
    | "integer"
    | "bool"
    | "file"
    | "select"
    | "dropdown"
    | "date"
    | "multiselect"
  unit: string | null
  regex_pattern: string | null
  is_required: boolean
  display_page: number
  options: (string | PropertyOption)[]
}

export interface SubCategoryResponse {
  id: number
  name: string
  slug: string
  description: string
  properties: Property[]
}

export function useSubCategories(subCategoryId: number | null) {
  const [subCategoryData, setSubCategoryData] =
    useState<SubCategoryResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    if (subCategoryId === null) {
      setSubCategoryData(null)
      return
    }

    setIsLoading(true)
    request
      .get({ url: API_URLS.subCategories({ id: subCategoryId }) })
      .then((data: SubCategoryResponse) => {
        setSubCategoryData(data)
        setError(null)
      })
      .catch((err) => {
        setError(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [subCategoryId])

  return {
    properties: subCategoryData?.properties || [],
    subCategoryName: subCategoryData?.name || "",
    subCategoryDescription: subCategoryData?.description || "",
    isLoading,
    error,
  }
}

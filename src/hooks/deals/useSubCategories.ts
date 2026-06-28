import useSWR from "swr"
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
    | "map"
    | "boolean_integer"
    | "boolean_string"
    | "boolean_date"
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
  const {
    data: subCategoryData,
    error,
    isLoading,
  } = useSWR<SubCategoryResponse, unknown>(
    subCategoryId ? API_URLS.subCategories({ id: subCategoryId }) : null,
    (url: string) => request.get({ url }),
  )

  return {
    properties: subCategoryData?.properties || [],
    subCategoryName: subCategoryData?.name || "",
    subCategoryDescription: subCategoryData?.description || "",
    isLoading,
    error,
  }
}

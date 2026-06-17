import useSWR from "swr"
import request from "@/request/request"
import API_URLS from "@/constants/urls/API_URLS"

export interface DocumentRequirement {
  id: number
  title: string
  document_type_code: string
  requirement_type: "required" | "optional" | "conditional"
  files_min: number
  files_max: number
  maximum_size: number | null
  allowed_upload_roles?: string[]
  condition_key?: string | null
  description?: string | null
  sub_category: number
  name?: string
  slug?: string
  is_required?: boolean
  file_types?: string[]
}

function normalizeDocumentRequirements(data: unknown): DocumentRequirement[] {
  if (Array.isArray(data)) return data as DocumentRequirement[]

  if (typeof data === "object" && data !== null && "collection" in data) {
    const { collection } = data as { collection?: unknown }
    if (Array.isArray(collection)) {
      return collection as DocumentRequirement[]
    }
  }

  return []
}

export function useDocumentRequirements(subCategoryId: number | null) {
  const { data, error, isLoading } = useSWR(
    subCategoryId ? API_URLS.documentRequirements({ id: subCategoryId }) : null,
    (url: string) => request.get({ url }),
  )

  console.log("useDocumentRequirements", { data, error, isLoading })

  return {
    documentRequirements: normalizeDocumentRequirements(data?.requirements),
    isLoading,
    error,
  }
}

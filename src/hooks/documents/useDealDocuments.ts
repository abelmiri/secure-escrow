import useSWR from "swr"
import API_URLS from "@/constants/urls/API_URLS"
import request from "@/request/request"

export interface UploadedDocumentReview {
  [key: string]: unknown
}

export interface UploadedDealDocument {
  id: string
  deal: number
  document_requirement: number
  document_name: string
  file_name: string
  file_type: string
  file_size: number
  uploaded_by: number
  uploader: string
  uploaded_by_role: string
  upload_status: string
  verification_status: string
  rejection_reason: string | null
  sha256_hash: string
  description: string | null
  version: number
  is_latest: boolean
  download_url: string
  reviews: UploadedDocumentReview[]
  created_at: string
  updated_at: string
}

function normalizeDealDocuments(data: unknown): UploadedDealDocument[] {
  if (Array.isArray(data)) return data as UploadedDealDocument[]
  if (!data || typeof data !== "object") return []

  const response = data as Record<string, unknown>
  const possibleCollections = [
    response.collection,
    response.results,
    response.documents,
    response.data,
  ]
  const collection = possibleCollections.find(Array.isArray)

  return Array.isArray(collection) ? (collection as UploadedDealDocument[]) : []
}

export function useDealDocuments(dealId: number | null) {
  const { data, error, isLoading, mutate } = useSWR(
    dealId ? API_URLS.dealDocuments({ id: dealId }) : null,
    (url: string) => request.get({ url }),
  )

  return {
    documents: normalizeDealDocuments(data),
    isLoading,
    error,
    mutate,
  }
}

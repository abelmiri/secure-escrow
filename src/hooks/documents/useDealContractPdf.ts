import { useEffect, useMemo } from "react"
import useSWR from "swr"
import API_URLS from "@/constants/urls/API_URLS"
import { getRequestErrorMessage } from "@/lib/errorHelpers"
import { toastManager } from "@/lib/toastManager"
import headerMaker from "@/request/headerMaker"
import urlMaker from "@/request/urlMaker"
import {
  normalizeDealDocument,
  type UploadedDealDocument,
} from "./useDealDocuments"

type ContractPdfResponse = Blob | string | Record<string, unknown>

function getContractUrl(data: Record<string, unknown>) {
  const nestedData =
    typeof data.data === "object" && data.data !== null
      ? (data.data as Record<string, unknown>)
      : null
  const possibleUrls = [
    data.download_url,
    data.contract_pdf_url,
    data.pdf_url,
    data.url,
    data.file,
    nestedData?.download_url,
    nestedData?.contract_pdf_url,
    nestedData?.pdf_url,
    nestedData?.url,
    nestedData?.file,
  ]

  return possibleUrls.find(
    (value): value is string => typeof value === "string" && value.length > 0,
  )
}

function getContractDocument(
  data: ContractPdfResponse | undefined,
): UploadedDealDocument | null {
  if (!data || typeof data !== "object" || data instanceof Blob) return null

  const directDocument = normalizeDealDocument(data)
  if (directDocument) return directDocument

  return normalizeDealDocument(data.data)
}

async function fetchContractPdf(url: string): Promise<ContractPdfResponse> {
  const response = await fetch(urlMaker({ url }), {
    headers: headerMaker(),
  })

  if (!response.ok) {
    const contentType = response.headers.get("content-type") || ""
    let errorData: unknown

    try {
      errorData = contentType.includes("application/json")
        ? await response.json()
        : await response.text()
    } catch {
      errorData = null
    }

    toastManager.addToast({
      message: getRequestErrorMessage({
        status: response.status,
        data: errorData,
      }),
      type: "FAIL",
    })

    throw { status: response.status, data: errorData }
  }

  const contentType = response.headers.get("content-type") || ""

  if (contentType.includes("application/json")) {
    return response.json() as Promise<Record<string, unknown>>
  }

  if (contentType.startsWith("text/")) {
    return response.text()
  }

  return response.blob()
}

export function useDealContractPdf(dealId: number | null) {
  const { data, error, isLoading } = useSWR(
    dealId ? API_URLS.dealContractPdf({ id: dealId }) : null,
    fetchContractPdf,
    { shouldRetryOnError: false },
  )
  const blobUrl = useMemo(
    () => (data instanceof Blob ? URL.createObjectURL(data) : ""),
    [data],
  )

  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl)
    }
  }, [blobUrl])

  const responseUrl =
    typeof data === "string"
      ? data
      : data && !(data instanceof Blob)
        ? getContractUrl(data)
        : ""
  const contractDocument = getContractDocument(data)

  return {
    contractDocument,
    contractPdfUrl:
      contractDocument?.download_url || blobUrl || responseUrl || "",
    isLoading,
    error,
  }
}

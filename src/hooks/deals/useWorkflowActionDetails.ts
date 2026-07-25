import useSWR from "swr"
import request from "@/request/request"
import API_URLS from "@/constants/urls/API_URLS"

export interface WorkflowField {
  id: number
  slug: string
  property_name: string
  label: string
  field_type: "date" | "text" | "number" | "select" | "checkbox" | "radio"
  unit: string | null
  display_page: number
  order: number
  required: boolean
  regex_pattern: string | null
  default_value: string | null
  options: Array<{ label: string; value: string }> | []
}

export interface WorkflowRequiredDocument {
  id: number
  document_type_code: string
  title: string
  description: string
  requirement_type: "required" | "optional"
  condition_key: string | null
  maximum_size: number
  maximum_size_bytes: number
  files_min: number
  files_max: number
  allowed_file_types: string[]
  allowed_upload_roles: string[]
}

export interface WorkflowTransition {
  transition_id: number
  from_step: number
  from_step_name: string
  to_step: number
  to_step_name: string
  actor_role: string
}

export interface WorkflowActionDetails {
  transition: WorkflowTransition
  action: string
  action_label: string
  fields: WorkflowField[]
  required_documents: WorkflowRequiredDocument[]
}

export function useWorkflowActionDetails(dealId: number | null, transitionId: number | null) {
  const { data, error, isLoading } = useSWR<WorkflowActionDetails>(
    dealId && transitionId
      ? [API_URLS.dealWorkflowActionDetails({ id: dealId, transitionId })]
      : null,
    async (url) => {
      const response = await request.get({
        url,
        failMessage: "دریافت جزئیات اقدام با خطا مواجه شد.",
      })
      return response
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  return {
    actionDetails: data,
    isLoading,
    error,
  }
}

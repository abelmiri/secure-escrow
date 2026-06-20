export type PropertyInputValue =
  | string[]
  | string
  | number
  | boolean
  | Date
  | null
  | undefined

export type DocumentUpload = {
  id: string
  file: File
  requirementId: number
  status: "uploading" | "uploaded" | "failed"
}

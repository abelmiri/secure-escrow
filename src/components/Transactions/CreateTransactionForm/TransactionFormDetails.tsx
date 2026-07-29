"use client"

import { useContext, useEffect, useRef, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button, CircularProgress } from "@mui/material"
import ListInput from "@/components/ListInput/ListInput"
import { authContext } from "@/context/auth/authProvider"
import API_URLS from "@/constants/urls/API_URLS"
import { useCategories } from "@/hooks/deals/useCategories"
import { useSubCategories, type Property } from "@/hooks/deals/useSubCategories"
import { useDeal } from "@/hooks/deals/useDeal"
import { useDealWorkflowAction } from "@/hooks/deals/useDealWorkflowAction"
import { useUpdateDeal } from "@/hooks/deals/useUpdateDeal"
import { useDealDocuments } from "@/hooks/documents/useDealDocuments"
import { useDocumentRequirements } from "@/hooks/documents/useDocumentRequirements"
import type { DocumentRequirement } from "@/hooks/documents/useDocumentRequirements"
import request from "@/request/request"
import RadioButton from "@/components/RadioButton/RadioButton"
import {
  clearTransactionPrefill,
  loadTransactionPrefill,
  parseTransactionPrefillFromSearchParams,
  tomanToRial,
} from "@/lib/transactionPrefill"
import { isDocumentRequirementAllowedForRole } from "@/lib/transactionDocumentRequirements"
import DocumentRequirementField, {
  type DocumentUpload,
} from "./DocumentRequirementField"
import DynamicPropertyField, {
  type PropertyInputValue,
} from "./DynamicPropertyField"
import TransactionBasicDetails from "./TransactionBasicDetails"
import TransactionFinancialDetails from "./TransactionFinancialDetails"
import TransactionPropertiesSection from "./TransactionPropertiesSection"
import TransactionReviewStage from "./TransactionReviewStage"
import styles from "./styles/TransactionFormDetails.module.scss"

const totalAmountLessThanEscrowMessage =
  "مبلغ نهایی کل معامله نمی‌تواند کمتر از مبلغ واریزی به حساب امانی باشد."

const iranianMobilePattern = /^09[0-9]{9}$/

const partyRoleLabels: Record<string, string> = {
  customer: "خریدار",
  beneficiary: "فروشنده",
}

const normalizeIranMobileForInput = (mobile?: string) => {
  if (!mobile) return ""
  if (mobile.startsWith("+98")) return `0${mobile.slice(3)}`
  if (mobile.startsWith("98")) return `0${mobile.slice(2)}`
  return mobile
}

const areSameIranMobile = (first?: string, second?: string) =>
  Boolean(first && second) &&
  normalizeIranMobileForInput(first) === normalizeIranMobileForInput(second)

const conditionalPropertyTypes = [
  "boolean_integer",
  "boolean_string",
  "boolean_date",
] as const

const isConditionalPropertyType = (fieldType: string) =>
  conditionalPropertyTypes.some((type) => type === fieldType)

const normalizeOptionText = (value: unknown) =>
  String(value ?? "")
    .trim()
    .replace(/[،,]+$/g, "")
    .trim()

const splitOptionText = (value: unknown) =>
  String(value ?? "")
    .split(/[،,]/)
    .map(normalizeOptionText)
    .filter(Boolean)

const getOptionItems = (property: Property) =>
  property.options?.map((option) =>
    typeof option === "string"
      ? { label: option, value: option }
      : { label: option.label, value: option.value },
  ) || []

const normalizeSingleOptionValue = (property: Property, value: unknown) => {
  const normalizedValue = normalizeOptionText(value)
  if (!normalizedValue) return ""

  const matchedOption = getOptionItems(property).find(
    (option) =>
      normalizeOptionText(option.value) === normalizedValue ||
      normalizeOptionText(option.label) === normalizedValue,
  )

  return matchedOption?.value || normalizedValue
}

const normalizeBooleanOptionValue = (property: Property, value: unknown) => {
  if (typeof value === "boolean") return value

  const normalizedValue = normalizeSingleOptionValue(property, value)
  if (["yes", "true", "بله"].includes(normalizedValue)) return true
  if (["no", "false", "خیر"].includes(normalizedValue)) return false

  return value
}

const normalizePropertyInputValue = (
  property: Property,
  value: unknown,
): PropertyInputValue => {
  if (property.field_type === "select" || property.field_type === "dropdown") {
    return normalizeSingleOptionValue(property, value)
  }

  if (property.field_type === "multiselect") {
    const values = Array.isArray(value) ? value : splitOptionText(value)
    return values
      .map((item) => normalizeSingleOptionValue(property, item))
      .filter(Boolean)
  }

  if (isConditionalPropertyType(property.field_type)) {
    return normalizeBooleanOptionValue(property, value) as PropertyInputValue
  }

  return value as PropertyInputValue
}

interface TransactionFormDetailsProps {
  stageNumber?: number
  dealId?: number | null
  dealItemId?: number | null
  onDealCreated?: (dealId: number, itemId: number | null) => void
  onStageTwoCompleted?: () => void
  onPrevious?: () => void
}

export default function TransactionFormDetails({
  stageNumber = 1,
  dealId,
  dealItemId,
  onDealCreated,
  onStageTwoCompleted,
  onPrevious,
}: TransactionFormDetailsProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const workflowAction = searchParams.get("workflowAction")?.toLowerCase()
  const shouldReturnToDealAfterCompletion =
    searchParams.get("returnToDeal") === "true"
  const prefillAppliedRef = useRef(false)
  const dealPrefillAppliedRef = useRef<number | null>(null)
  const previousEscrowAmountRef = useRef("")
  const { authState } = useContext(authContext)

  const [role, setRole] = useState("customer")
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  )
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    number | null
  >(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [propertyValues, setPropertyValues] = useState<
    Record<string, PropertyInputValue>
  >({})
  const [escrowAmount, setEscrowAmount] = useState("")
  const [isTotalCost, setIsTotalCost] = useState("yes")
  const [totalTransactionAmount, setTotalTransactionAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [paymentDescription, setPaymentDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [counterpartyMobile, setCounterpartyMobile] = useState("")
  const [isRepresentative, setIsRepresentative] = useState(false)
  const [isTermsAccepted, setIsTermsAccepted] = useState(false)
  const [documentUploads, setDocumentUploads] = useState<DocumentUpload[]>([])
  const [documentValidationMessage, setDocumentValidationMessage] = useState("")
  const [requiredValidationMessage, setRequiredValidationMessage] = useState<
    string[]
  >([])
  const [fieldErrors, setFieldErrors] = useState<string[]>([])
  const [totalAmountError, setTotalAmountError] = useState("")

  const { categories, isLoading: isCategoriesLoading } = useCategories()
  const { updateDeal } = useUpdateDeal()
  const { submitWorkflowAction, isSubmitting: isSubmittingWorkflowAction } =
    useDealWorkflowAction()
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId)
  const subCategoriesList = selectedCategory?.sub_categories || []
  const selectedSubCategory = subCategoriesList.find(
    (subCategory) => subCategory.id === selectedSubCategoryId,
  )

  useEffect(() => {
    if (prefillAppliedRef.current) return

    const fromStorage = loadTransactionPrefill()
    const fromUrl = parseTransactionPrefillFromSearchParams(searchParams)
    const prefill = { ...fromStorage, ...fromUrl }

    if (prefill.role) {
      setRole(prefill.role)
    }

    if (prefill.amount) {
      const prefilledEscrowAmount = tomanToRial(prefill.amount)
      setEscrowAmount(prefilledEscrowAmount)
      setTotalTransactionAmount(prefilledEscrowAmount)
      previousEscrowAmountRef.current = prefilledEscrowAmount
      setIsTotalCost("yes")
    }

    if (prefill.categoryId) {
      setSelectedCategoryId(Number(prefill.categoryId))
    }

    clearTransactionPrefill()
    prefillAppliedRef.current = true
  }, [searchParams])

  const {
    properties,
    subCategoryName,
    subCategoryDescription,
    isLoading: isPropertiesLoading,
  } = useSubCategories(selectedSubCategoryId)

  const { documentRequirements, isLoading: isDocumentRequirementsLoading } =
    useDocumentRequirements(stageNumber === 2 ? selectedSubCategoryId : null)
  const { deal, isLoading: isDealLoading } = useDeal(dealId || null)
  const { documents: dealDocuments, isLoading: isDealDocumentsLoading } =
    useDealDocuments(stageNumber === 3 ? dealId || null : null)

  const stageProperties = properties.filter(
    (prop) => prop.display_page === stageNumber && prop.field_type !== "file",
  )

  const applicableDocumentRequirements = documentRequirements.filter(
    (requirement) => isDocumentRequirementAllowedForRole(requirement, role),
  )
  const applicableRequirementIds = new Set(
    applicableDocumentRequirements.map((requirement) => requirement.id),
  )
  const applicableDocumentUploads = documentUploads.filter((upload) =>
    applicableRequirementIds.has(upload.requirementId),
  )
  const hasUploadsInProgress = applicableDocumentUploads.some(
    (upload) => upload.status === "uploading",
  )
  const isPropertiesSectionLoading =
    isPropertiesLoading || (stageNumber === 2 && isDocumentRequirementsLoading)
  const hasVisibleProperties =
    stageNumber === 2
      ? applicableDocumentRequirements.length > 0
      : stageProperties.length > 0
  const currentDealItemId = dealItemId || deal?.items?.[0]?.id || null

  useEffect(() => {
    if (!dealId || !deal || dealPrefillAppliedRef.current === dealId) return
    if (categories.length === 0) return

    const currentUserMobile = authState.user?.mobile_number
    const firstItem = deal.items?.[0]
    const itemSubcategory = firstItem?.subcategory
    const subcategorySlug =
      typeof itemSubcategory === "object" ? itemSubcategory.slug : undefined
    const subcategoryName =
      typeof itemSubcategory === "object" ? itemSubcategory.name : itemSubcategory

    const matchedCategory = categories.find((category) =>
      category.sub_categories.some(
        (subCategory) =>
          subCategory.slug === subcategorySlug ||
          subCategory.name === subcategoryName,
      ),
    )
    const matchedSubCategory = matchedCategory?.sub_categories.find(
      (subCategory) =>
        subCategory.slug === subcategorySlug ||
        subCategory.name === subcategoryName,
    )

    const currentParty = currentUserMobile
      ? deal.parties?.find((party) => {
          const partyMobile =
            typeof party.user === "object"
              ? party.user?.mobile_number
              : party.user || party.mobile_number
          return areSameIranMobile(partyMobile, currentUserMobile)
        })
      : undefined
    const counterparty = currentUserMobile
      ? deal.parties?.find((party) => {
          const partyMobile =
            typeof party.user === "object"
              ? party.user?.mobile_number
              : party.user || party.mobile_number
          return !areSameIranMobile(partyMobile, currentUserMobile)
        })
      : deal.parties?.[1]
    const counterpartyMobile =
      typeof counterparty?.user === "object"
        ? counterparty.user?.mobile_number
        : counterparty?.user || counterparty?.mobile_number

    if (currentParty?.role) {
      setRole(currentParty.role)
    }
    setIsRepresentative(Boolean(currentParty?.is_representative))
    setCounterpartyMobile(normalizeIranMobileForInput(counterpartyMobile))

    if (matchedCategory) setSelectedCategoryId(matchedCategory.id)
    if (matchedSubCategory) setSelectedSubCategoryId(matchedSubCategory.id)

    setTitle(firstItem?.name || "")
    setDescription(firstItem?.description || "")
    setEscrowAmount(
      firstItem?.escrow_price !== undefined && firstItem?.escrow_price !== null
        ? String(firstItem.escrow_price)
        : "",
    )
    setTotalTransactionAmount(
      firstItem?.price !== undefined && firstItem?.price !== null
        ? String(firstItem.price)
        : "",
    )
    setPaymentMethod(firstItem?.remaining_price_payment_method || "")
    setPaymentDescription(firstItem?.remaining_price_payment_description || "")

    dealPrefillAppliedRef.current = dealId
  }, [authState.user?.mobile_number, categories, deal, dealId])

  useEffect(() => {
    if (!dealId || !deal || properties.length === 0) return

    const itemProperties = deal.items?.[0]?.properties
    if (!itemProperties) return

    setPropertyValues((currentValues) => {
      const nextValues = { ...currentValues }

      properties.forEach((property) => {
        const value =
          itemProperties[property.slug] ??
          itemProperties[property.name] ??
          itemProperties[property.property_name]

        if (value !== undefined) {
          nextValues[property.slug] = normalizePropertyInputValue(
            property,
            value,
          )
        }
      })

      return nextValues
    })
  }, [deal, dealId, properties])

  const isEmptyValue = (value: PropertyInputValue | string | number | null) => {
    if (Array.isArray(value)) return value.length === 0
    if (typeof value === "boolean") return false
    if (value instanceof Date) return false
    if (value === null || value === undefined) return true
    return String(value).trim() === ""
  }

  const getRequiredFieldIssues = () => {
    const issues: Array<{ key: string; label: string }> = []

    if (stageNumber === 1) {
      if (!selectedCategoryId) {
        issues.push({ key: "category", label: "دسته بندی معامله" })
      }

      if (!selectedSubCategoryId) {
        issues.push({ key: "subcategory", label: "نوع دسته بندی" })
      }

      if (!title.trim()) {
        issues.push({ key: "title", label: "عنوان معامله" })
      }

      stageProperties.forEach((property) => {
        const value = propertyValues[property.slug]
        const isMissingRequiredValue =
          property.is_required && isEmptyValue(value)
        const isMissingConditionalValue =
          isConditionalPropertyType(property.field_type) &&
          (value === true || value === "")

        if (isMissingRequiredValue || isMissingConditionalValue) {
          issues.push({
            key: `property:${property.slug}`,
            label: property.name,
          })
        }
      })

      if (!escrowAmount) {
        issues.push({
          key: "escrowAmount",
          label: "مبلغ واریزی به حساب امانی",
        })
      }

      if (isTotalCost === "no") {
        if (!totalTransactionAmount) {
          issues.push({
            key: "totalTransactionAmount",
            label: "مبلغ نهایی کل معامله",
          })
        }

        if (!paymentMethod) {
          issues.push({
            key: "paymentMethod",
            label: "شیوه پرداخت باقی‌مانده هزینه",
          })
        }
      }
    }

    if (stageNumber === 2) {
      const counterpartyMobileLabel =
        role === "beneficiary"
          ? "شماره موبایل خریدار"
          : "شماره موبایل فروشنده"

      issues.push(
        ...(!iranianMobilePattern.test(counterpartyMobile.trim())
          ? [
              {
                key: "counterpartyMobile",
                label: counterpartyMobileLabel,
              },
            ]
          : []),
      )

      applicableDocumentRequirements.forEach((requirement) => {
        const isRequired =
          requirement.is_required ?? requirement.requirement_type !== "optional"
        const minimumFiles = requirement.files_min || (isRequired ? 1 : 0)
        const uploadedCount = applicableDocumentUploads.filter(
          (upload) =>
            upload.requirementId === requirement.id &&
            upload.status === "uploaded",
        ).length

        if (uploadedCount < minimumFiles) {
          issues.push({
            key: `document:${requirement.id}`,
            label: requirement.title || requirement.name || "سند مورد نیاز",
          })
        }
      })
    }

    return issues
  }

  const getTotalAmountValidationMessage = () => {
    if (stageNumber !== 1 || !escrowAmount || !totalTransactionAmount) {
      return ""
    }

    if (Number(totalTransactionAmount) < Number(escrowAmount)) {
      return totalAmountLessThanEscrowMessage
    }

    return ""
  }

  const resetValidationMessages = () => {
    setRequiredValidationMessage([])
    setFieldErrors([])
    setTotalAmountError("")
  }

  const handlePropertyChange = (
    propertyName: string,
    value: PropertyInputValue,
  ) => {
    setPropertyValues((prev) => ({ ...prev, [propertyName]: value }))
    resetValidationMessages()
  }

  const handleEscrowAmountChange = (value: string) => {
    const previousEscrowAmount = previousEscrowAmountRef.current

    setEscrowAmount(value)
    if (
      value &&
      (!totalTransactionAmount ||
        totalTransactionAmount === previousEscrowAmount ||
        isTotalCost === "yes")
    ) {
      setTotalTransactionAmount(value)
    }
    previousEscrowAmountRef.current = value
    resetValidationMessages()
  }

  const updateDocumentUpload = (
    uploadId: string,
    changes: Partial<DocumentUpload>,
  ) => {
    setDocumentUploads((current) =>
      current.map((upload) =>
        upload.id === uploadId ? { ...upload, ...changes } : upload,
      ),
    )
  }

  const uploadDocument = async (upload: DocumentUpload) => {
    if (!dealId) {
      updateDocumentUpload(upload.id, { status: "failed" })
      return
    }

    const formData = new FormData()
    formData.append("deal_id", String(dealId))
    formData.append("document_requirement_id", String(upload.requirementId))
    formData.append("file", upload.file)

    updateDocumentUpload(upload.id, {
      status: "uploading",
    })

    try {
      await request.post({
        url: API_URLS.documentUpload(),
        data: formData,
        dontToast: true,
      })
      updateDocumentUpload(upload.id, {
        status: "uploaded",
      })
    } catch {
      updateDocumentUpload(upload.id, {
        status: "failed",
      })
    }
  }

  const handleDocumentFiles = (
    requirement: DocumentRequirement,
    selectedFiles: File[],
  ) => {
    if (
      !dealId ||
      selectedFiles.length === 0 ||
      !isDocumentRequirementAllowedForRole(requirement, role)
    ) {
      return
    }

    const maxFiles = requirement.files_max || 3
    const existingCount = documentUploads.filter(
      (upload) => upload.requirementId === requirement.id,
    ).length
    const availableSlots = Math.max(maxFiles - existingCount, 0)
    const files = selectedFiles.slice(0, availableSlots)

    if (files.length === 0) return

    const uploads = files.map(
      (file, index): DocumentUpload => ({
        id: `${requirement.id}-${Date.now()}-${index}-${file.name}`,
        file,
        requirementId: requirement.id,
        status: "uploading",
      }),
    )

    setDocumentValidationMessage("")
    resetValidationMessages()
    setDocumentUploads((current) => [...current, ...uploads])
    uploads.forEach((upload) => void uploadDocument(upload))
  }

  const handleRemoveDocumentUpload = (uploadId: string) => {
    setDocumentUploads((current) =>
      current.filter((upload) => upload.id !== uploadId),
    )
    setDocumentValidationMessage("")
    resetValidationMessages()
  }

  const handleContinue = async () => {
    if (stageNumber === 3) {
      if (!isTermsAccepted) return
      if (!dealId) return

      const reviewAction =
        (workflowAction
          ? deal?.next_available_actions?.find(
              (action) => action.action.toLowerCase() === workflowAction,
            )
          : undefined) ||
        deal?.next_available_actions?.find((action) =>
          ["join", "accept"].includes(action.action.toLowerCase()),
        ) ||
        deal?.next_available_actions?.find(
          (action) => action.action.toLowerCase() !== "form",
        ) ||
        deal?.next_available_actions?.[0]

      try {
        if (reviewAction) {
          await submitWorkflowAction(dealId, {
            transition_id: reviewAction.transition_id,
          })
        }

        router.push(`/dashboard/${dealId}`)
      } catch (error) {
        console.error("Error submitting review action:", error)
      }
      return
    }

    if (!authState.user) return

    if (stageNumber === 2) {
      const pendingUpload = applicableDocumentUploads.some(
        (upload) => upload.status === "uploading",
      )
      const failedUpload = applicableDocumentUploads.some(
        (upload) => upload.status === "failed",
      )

      if (pendingUpload) {
        setDocumentValidationMessage(
          "لطفاً تا پایان بارگذاری فایل‌ها صبر کنید.",
        )
        return
      }

      if (failedUpload) {
        setDocumentValidationMessage(
          "بارگذاری بعضی فایل‌ها ناموفق بود؛ آن‌ها را دوباره ارسال کنید.",
        )
        return
      }
    }

    const requiredIssues = getRequiredFieldIssues()
    const totalValidationMessage = getTotalAmountValidationMessage()

    if (requiredIssues.length > 0 || totalValidationMessage) {
      setFieldErrors(requiredIssues.map((issue) => issue.key))
      setRequiredValidationMessage(requiredIssues.map((issue) => issue.label))
      setTotalAmountError(totalValidationMessage)
      return
    }

    resetValidationMessages()

    if (!selectedSubCategoryId) return

    if (stageNumber === 2) {
      const missingRequirement = applicableDocumentRequirements.find(
        (requirement) => {
          const isRequired =
            requirement.is_required ??
            requirement.requirement_type !== "optional"
          const minimumFiles = requirement.files_min || (isRequired ? 1 : 0)
          const uploadedCount = applicableDocumentUploads.filter(
            (upload) =>
              upload.requirementId === requirement.id &&
              upload.status === "uploaded",
          ).length

          return uploadedCount < minimumFiles
        },
      )

      if (missingRequirement) {
        setDocumentValidationMessage(
          `حداقل تعداد فایل لازم برای «${missingRequirement.title || missingRequirement.name}» را بارگذاری کنید.`,
        )
        return
      }
    }

    setIsSubmitting(true)

    const propertiesData: Record<string, unknown> = {}
    properties
      .filter((prop) => prop.field_type !== "file")
      .forEach((prop) => {
        const value = normalizePropertyInputValue(prop, propertyValues[prop.slug])

        if (
          prop.field_type === "integer" ||
          prop.field_type === "boolean_integer"
        ) {
          if (value === false || value === undefined) {
            propertiesData[prop.slug] = value ?? ""
            return
          }

          const integerValue =
            value === "" || value === true ? "" : Number(value)
          propertiesData[prop.slug] = Number.isFinite(integerValue)
            ? integerValue
            : ""
        } else {
          propertiesData[prop.slug] = value ?? ""
        }
      })

    const primaryParty: {
      user: string
      role: string
      is_representative?: boolean
    } = {
      user: authState.user.mobile_number,
      role,
    }

    if (stageNumber === 2 && role !== "broker") {
      primaryParty.is_representative = isRepresentative
    }

    const secondPartyMobile = counterpartyMobile.trim()
    const secondPartyRole = role === "beneficiary" ? "customer" : "beneficiary"

    const parties = [primaryParty]
    if (secondPartyMobile) {
      parties.push({ user: secondPartyMobile, role: secondPartyRole })
    }

    try {
      if (stageNumber === 1) {
        const payload = {
          items: [
            {
              ...(dealId && currentDealItemId ? { id: currentDealItemId } : {}),
              subcategory: selectedSubCategory?.slug || "",
              name: title,
              description,
              remaining_price_payment_method: paymentMethod,
              escrow_price: Number(escrowAmount),
              price: Number(totalTransactionAmount || escrowAmount),
              properties: propertiesData,
            },
          ],
          parties,
        }

        if (dealId) {
          await updateDeal(dealId, payload, {
            successMessage: "اطلاعات معامله با موفقیت به‌روزرسانی شد",
            failMessage: "خطا در به‌روزرسانی معامله",
          })
          onDealCreated?.(dealId, null)
        } else {
          const response = await request.post({
            url: API_URLS.deals,
            data: payload,
            successMessage: "معامله با موفقیت ثبت شد",
            failMessage: "خطا در ثبت معامله",
          })

          const responseData =
            typeof response === "object" && response !== null ? response : null
          const createdDealId =
            responseData && "id" in responseData
              ? ((responseData as { id?: number }).id ?? null)
              : null
          const createdItemId =
            responseData && "items" in responseData
              ? ((responseData as { items?: Array<{ id?: number }> }).items?.[0]
                  ?.id ?? null)
              : null
          if (createdDealId && onDealCreated) {
            onDealCreated(createdDealId, createdItemId)
          }
        }
      } else if (stageNumber === 2 && dealId) {
        const patchPayload = {
          parties,
        }

        await updateDeal(dealId, patchPayload, {
          successMessage: "اطلاعات با موفقیت به‌روزرسانی شد",
          failMessage: "خطا در به‌روزرسانی اطلاعات",
        })

        if (shouldReturnToDealAfterCompletion) {
          router.push(`/dashboard/${dealId}`)
          return
        }

        onStageTwoCompleted?.()
      }
    } catch (error) {
      console.error("Error processing deal stage:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderDocumentRequirement = (requirement: DocumentRequirement) => {
    const uploads = documentUploads.filter(
      (upload) => upload.requirementId === requirement.id,
    )

    return (
      <DocumentRequirementField
        key={requirement.id}
        requirement={requirement}
        uploads={uploads}
        dealId={dealId}
        onFilesSelected={handleDocumentFiles}
        onRetry={(upload) => void uploadDocument(upload)}
        onRemove={handleRemoveDocumentUpload}
        error={fieldErrors.includes(`document:${requirement.id}`)}
      />
    )
  }

  const renderProperty = (property: (typeof properties)[number]) => {
    return (
      <DynamicPropertyField
        key={property.slug}
        property={property}
        subCategorySlug={selectedSubCategory?.slug}
        value={propertyValues[property.slug]}
        error={fieldErrors.includes(`property:${property.slug}`)}
        onChange={(value) => handlePropertyChange(property.slug, value)}
      />
    )
  }

  const uploadedDocuments = documentUploads
    .filter((upload) => upload.status === "uploaded")
    .map((upload) => upload.file)

  const headerTitle =
    stageNumber === 3
      ? "بررسی و ارسال"
      : stageNumber === 2
        ? "اطلاعات طرفین و اسناد"
        : "جزئیات تراکنش"
  const headerDescription =
    stageNumber === 3
      ? "جزئیات معامله خود را قبل از ارسال بررسی کنید"
      : stageNumber === 2
        ? "مشخصات خریدار هدف و اسناد مورد نیاز را وارد کنید"
        : "اطلاعات دقیق محصول یا دارایی مورد معامله را وارد کنید"
  const displayedTotalAmountError =
    totalAmountError || getTotalAmountValidationMessage()

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTextBlack}>{headerTitle}</div>
        <div className={styles.headerTextGray}>{headerDescription}</div>
      </div>

      {stageNumber === 1 && (
        <TransactionBasicDetails
          role={role}
          categories={categories}
          subCategories={subCategoriesList}
          selectedCategoryId={selectedCategoryId}
          selectedSubCategoryId={selectedSubCategoryId}
          isCategoriesLoading={isCategoriesLoading}
          title={title}
          description={description}
          onRoleChange={(nextRole) => {
            setRole(nextRole)
            setDocumentValidationMessage("")
            resetValidationMessages()
          }}
          onCategoryChange={(categoryId) => {
            setSelectedCategoryId(categoryId)
            setSelectedSubCategoryId(null)
            resetValidationMessages()
          }}
          onSubCategoryChange={(subCategoryId) => {
            setSelectedSubCategoryId(subCategoryId)
            resetValidationMessages()
          }}
          onTitleChange={(value) => {
            setTitle(value)
            resetValidationMessages()
          }}
          onDescriptionChange={setDescription}
          fieldErrors={fieldErrors}
        />
      )}

      {stageNumber === 2 && (
        <>
          <ListInput
            title={
              role === "beneficiary"
                ? "شماره موبایل خریدار"
                : "شماره موبایل فروشنده"
            }
            placeholder={
              role === "beneficiary"
                ? "شماره موبایل خریدار"
                : "شماره موبایل فروشنده"
            }
            value={counterpartyMobile}
            onChange={(value) => {
              setCounterpartyMobile(value)
              resetValidationMessages()
            }}
            valueType="string"
            regex={iranianMobilePattern}
            rejectPersianDigits
            required
            error={fieldErrors.includes("counterpartyMobile")}
          />

          {role !== "broker" && (
            <div className={styles.roleSelect}>
              <div className={styles.roleSelectText}>
                آیا نماینده {partyRoleLabels[role]} هستید؟
              </div>
              <RadioButton
                title={`خیر، خود ${partyRoleLabels[role]} هستم`}
                name="is-representative"
                value="false"
                checked={!isRepresentative}
                onChange={() => setIsRepresentative(false)}
              />
              <RadioButton
                title={`بله، نماینده ${partyRoleLabels[role]} هستم`}
                name="is-representative"
                value="true"
                checked={isRepresentative}
                onChange={() => setIsRepresentative(true)}
              />
            </div>
          )}
        </>
      )}

      {stageNumber === 3 && (
        <TransactionReviewStage
          deal={deal}
          contractDocument={null}
          documents={dealDocuments}
          isDealLoading={isDealLoading}
          isContractPdfLoading={false}
          isDocumentsLoading={isDealDocumentsLoading}
          isSubmitting={isSubmitting || isSubmittingWorkflowAction}
          isTermsAccepted={isTermsAccepted}
          userMobile={authState.user?.mobile_number}
          role={role}
          categoryName={selectedCategory?.name}
          subCategoryName={subCategoryName}
          title={title}
          description={description}
          escrowAmount={escrowAmount}
          totalTransactionAmount={totalTransactionAmount}
          paymentMethod={paymentMethod}
          localDocuments={uploadedDocuments}
          onTermsAcceptedChange={setIsTermsAccepted}
          onPrevious={onPrevious}
          onSubmit={handleContinue}
        />
      )}

      <TransactionPropertiesSection
        stageNumber={stageNumber}
        isLoading={isPropertiesSectionLoading}
        hasItems={hasVisibleProperties}
        subCategoryName={subCategoryName}
        subCategoryDescription={subCategoryDescription}
      >
        {stageNumber === 2
          ? applicableDocumentRequirements.map(renderDocumentRequirement)
          : stageProperties.map(renderProperty)}
      </TransactionPropertiesSection>

      {stageNumber !== 3 && !isPropertiesLoading && (
        <>
          {stageNumber === 1 && selectedSubCategoryId && (
            <TransactionFinancialDetails
              escrowAmount={escrowAmount}
              isTotalCost={isTotalCost}
              totalTransactionAmount={totalTransactionAmount}
              paymentMethod={paymentMethod}
              paymentDescription={paymentDescription}
              fieldErrors={fieldErrors}
              totalAmountError={displayedTotalAmountError}
              onEscrowAmountChange={handleEscrowAmountChange}
              onIsTotalCostChange={(value) => {
                setIsTotalCost(value)
                if (value === "yes" && escrowAmount) {
                  setTotalTransactionAmount(escrowAmount)
                }
                resetValidationMessages()
              }}
              onTotalTransactionAmountChange={(value) => {
                setTotalTransactionAmount(value)
                resetValidationMessages()
              }}
              onPaymentMethodChange={(value) => {
                setPaymentMethod(value)
                resetValidationMessages()
              }}
              onPaymentDescriptionChange={setPaymentDescription}
            />
          )}

          <div className={styles.buttonGroup}>
            {stageNumber === 2 && onPrevious && (
              <Button
                variant="outlined"
                onClick={onPrevious}
                disabled={isSubmitting || hasUploadsInProgress}
              >
                قبلی
              </Button>
            )}
            <Button
              className={styles.buttonPrimary}
              variant="contained"
              onClick={handleContinue}
              disabled={isSubmitting || hasUploadsInProgress}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "ادامه"
              )}
            </Button>
          </div>
          {stageNumber === 2 && documentValidationMessage && (
            <div className={styles.uploadValidationMessage}>
              {documentValidationMessage}
            </div>
          )}
          {requiredValidationMessage.length > 0 && (
            <div className={styles.uploadValidationMessage}>
              فیلدهای زیر را تکمیل کنید:
              <ul className={styles.validationList}>
                {requiredValidationMessage.map((fieldName) => (
                  <li key={fieldName}>{fieldName}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  )
}

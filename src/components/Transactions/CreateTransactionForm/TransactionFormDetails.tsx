"use client"

import { useContext, useEffect, useRef, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import RadioButton from "@/components/RadioButton/RadioButton"
import Dropdown from "@/components/DropDownInput/DropDownInput"
import ListInput from "@/components/ListInput/ListInput"
import styles from "./styles/TransactionFormDetails.module.scss"
import { Button, Checkbox, CircularProgress } from "@mui/material"
import { useCategories } from "@/hooks/deals/useCategories"
import { useSubCategories } from "@/hooks/deals/useSubCategories"
import { useDeal } from "@/hooks/deals/useDeal"
import { useDocumentRequirements } from "@/hooks/documents/useDocumentRequirements"
import type { DocumentRequirement } from "@/hooks/documents/useDocumentRequirements"
import { authContext } from "@/context/auth/authProvider"
import request from "@/request/request"
import API_URLS from "@/constants/urls/API_URLS"
import {
  clearTransactionPrefill,
  loadTransactionPrefill,
  parseTransactionPrefillFromSearchParams,
  tomanToRial,
} from "@/lib/transactionPrefill"
import DealReview from "./DealReview"
import DocumentRequirementField from "./DocumentRequirementField"
import DynamicPropertyField from "./DynamicPropertyField"
import type { DocumentUpload, PropertyInputValue } from "./types"

const roles = [
  { title: "خریدار", value: "customer" },
  { title: "فروشنده", value: "beneficiary" },
  { title: "کارگزار (واسط)", value: "broker" },
]

export default function TransactionFormDetails({
  stageNumber = 1,
  dealId,
  onDealCreated,
  onStageTwoCompleted,
  onPrevious,
}: {
  stageNumber?: number
  dealId?: number | null
  onDealCreated?: (dealId: number, itemId: number | null) => void
  onStageTwoCompleted?: () => void
  onPrevious?: () => void
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const prefillAppliedRef = useRef(false)
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
  const [isTermsAccepted, setIsTermsAccepted] = useState(false)
  const [documentUploads, setDocumentUploads] = useState<DocumentUpload[]>([])
  const [documentValidationMessage, setDocumentValidationMessage] = useState("")

  const { categories, isLoading: isCategoriesLoading } = useCategories()
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId)
  const subCategoriesList = selectedCategory?.sub_categories || []

  useEffect(() => {
    if (prefillAppliedRef.current) return

    const fromStorage = loadTransactionPrefill()
    const fromUrl = parseTransactionPrefillFromSearchParams(searchParams)
    const prefill = { ...fromStorage, ...fromUrl }

    if (prefill.role) {
      setRole(prefill.role)
    }

    if (prefill.amount) {
      setEscrowAmount(tomanToRial(prefill.amount))
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
  const { deal, isLoading: isDealLoading } = useDeal(
    stageNumber === 3 ? dealId || null : null,
  )

  const stageProperties = properties.filter(
    (prop) => prop.display_page === stageNumber && prop.field_type !== "file",
  )

  const visibleStageProperties =
    stageNumber === 2 ? documentRequirements : stageProperties
  const hasUploadsInProgress = documentUploads.some(
    (upload) => upload.status === "uploading",
  )

  const handlePropertyChange = (
    propertyName: string,
    value: PropertyInputValue,
  ) => {
    setPropertyValues((prev) => ({ ...prev, [propertyName]: value }))
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
    if (!dealId || selectedFiles.length === 0) return

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
    setDocumentUploads((current) => [...current, ...uploads])
    uploads.forEach((upload) => void uploadDocument(upload))
  }

  const handleContinue = async () => {
    if (stageNumber === 3) {
      if (!isTermsAccepted) return
      router.push("/dashboard")
      return
    }

    if (!selectedSubCategoryId || !authState.user) return

    if (stageNumber === 2) {
      const pendingUpload = documentUploads.some(
        (upload) => upload.status === "uploading",
      )
      const failedUpload = documentUploads.some(
        (upload) => upload.status === "failed",
      )
      const missingRequirement = documentRequirements.find((requirement) => {
        const isRequired =
          requirement.is_required ?? requirement.requirement_type !== "optional"
        const minimumFiles = requirement.files_min || (isRequired ? 1 : 0)
        const uploadedCount = documentUploads.filter(
          (upload) =>
            upload.requirementId === requirement.id &&
            upload.status === "uploaded",
        ).length

        return uploadedCount < minimumFiles
      })

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

      if (missingRequirement) {
        setDocumentValidationMessage(
          `حداقل تعداد فایل لازم برای «${missingRequirement.title || missingRequirement.name}» را بارگذاری کنید.`,
        )
        return
      }
    }

    setIsSubmitting(true)

    const selectedSubCategory = subCategoriesList.find(
      (sc) => sc.id === selectedSubCategoryId,
    )

    const propertiesData: Record<string, unknown> = {}
    properties
      .filter((prop) => prop.field_type !== "file")
      .forEach((prop) => {
        const value = propertyValues[prop.slug]

        if (prop.field_type === "integer") {
          const integerValue =
            value === "" || value === undefined ? "" : Number(value)
          propertiesData[prop.slug] = Number.isFinite(integerValue)
            ? integerValue
            : ""
        } else {
          propertiesData[prop.slug] = value ?? ""
        }
      })

    const primaryParty = {
      user: authState.user.mobile_number,
      role,
    }

    const secondPartyMobile = counterpartyMobile.trim()
    const secondPartyRole = role === "beneficiary" ? "customer" : "beneficiary"

    const parties = [primaryParty]
    if (stageNumber === 2 && secondPartyMobile) {
      parties.push({ user: secondPartyMobile, role: secondPartyRole })
    }

    try {
      if (stageNumber === 1) {
        const payload = {
          items: [
            {
              subcategory: selectedSubCategory?.slug || "",
              name: title,
              description,
              remaining_price_payment_method: paymentMethod,
              total_price: Number(totalTransactionAmount),
              price: Number(escrowAmount),
              properties: propertiesData,
            },
          ],
          parties,
        }

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
      } else if (stageNumber === 2 && dealId) {
        const patchPayload: Record<string, unknown> = {
          parties,
        }

        await request.patch({
          url: API_URLS.deal({ id: dealId }),
          data: patchPayload,
          successMessage: "اطلاعات با موفقیت به‌روزرسانی شد",
          failMessage: "خطا در به‌روزرسانی اطلاعات",
        })
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
      />
    )
  }

  const renderProperty = (property: (typeof properties)[number]) => {
    return (
      <DynamicPropertyField
        key={property.slug}
        property={property}
        value={propertyValues[property.slug]}
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTextBlack}>{headerTitle}</div>
        <div className={styles.headerTextGray}>{headerDescription}</div>
      </div>

      {stageNumber === 1 && (
        <>
          <div className={styles.roleSelect}>
            <div className={styles.roleSelectText}>نقش شما در این معامله</div>
            {roles.map((data) => (
              <RadioButton
                key={data.value}
                title={data.title}
                name="user-role"
                value={data.value}
                checked={role === data.value}
                onChange={() => setRole(data.value)}
              />
            ))}
          </div>

          <Dropdown
            title="دسته بندی معامله"
            placeholder={
              isCategoriesLoading
                ? "در حال بارگذاری..."
                : "یک دسته بندی انتخاب کنید"
            }
            options={categories.map((item) => ({
              label: item.name,
              slug: item.id.toString(), // We use ID as slug for Dropdown to manage sub-category fetch
            }))}
            initialSlug={selectedCategoryId?.toString()}
            onChange={(id: string) => {
              setSelectedCategoryId(Number(id))
              setSelectedSubCategoryId(null) // Reset sub-category on parent change
            }}
          />

          <Dropdown
            title="نوع دسته بندی"
            placeholder={
              !selectedCategoryId
                ? "ابتدا دسته بندی اصلی را انتخاب کنید"
                : "زیر دسته بندی انتخاب کنید"
            }
            options={subCategoriesList.map((item) => ({
              label: item.name,
              slug: item.id.toString(),
            }))}
            initialSlug={selectedSubCategoryId?.toString()}
            onChange={(id: string) => setSelectedSubCategoryId(Number(id))}
            disabled={!selectedCategoryId}
          />

          <ListInput
            valueType="string"
            placeholder="عنوان کوتاه و مشخص"
            title="عنوان معامله"
            value={title}
            onChange={setTitle}
            regex={/^[\u0600-\u06FFa-zA-Z\s]+$/}
          />

          <ListInput
            textarea
            placeholder="جهت درج هر نوع توضیحات تکمیلی..."
            title="توضیحات اضافی"
            value={description}
            onChange={setDescription}
          />
        </>
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
            onChange={setCounterpartyMobile}
            valueType="string"
          />
        </>
      )}

      {stageNumber === 3 && (
        <>
          {isDealLoading ? (
            <div className={styles.reviewLoading}>
              <CircularProgress size={24} />
            </div>
          ) : (
            <div className={styles.reviewContainer}>
              <DealReview
                deal={deal}
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
              />
            </div>
          )}

          <div className={styles.termsRow}>
            <Checkbox
              checked={isTermsAccepted}
              onChange={(event) => setIsTermsAccepted(event.target.checked)}
              sx={{
                color: "#d0d5dd",
                "&.Mui-checked": { color: "var(--color-secondary)" },
              }}
            />
            <span>
              من با{" "}
              <a href="/terms" target="_blank" rel="noreferrer">
                شرایط استفاده
              </a>{" "}
              و{" "}
              <a href="/escrow-agreement" target="_blank" rel="noreferrer">
                قرارداد اسکرو
              </a>{" "}
              موافقم و تایید می‌کنم که معامله پس از تایید طرف دیگر ادامه خواهد
              یافت.
            </span>
          </div>

          <div className={styles.buttonGroup}>
            {onPrevious && (
              <Button
                variant="outlined"
                onClick={onPrevious}
                disabled={isSubmitting}
              >
                قبلی
              </Button>
            )}
            <Button
              className={`${styles.buttonPrimary} ${styles.submitReviewButton}`}
              variant="contained"
              onClick={handleContinue}
              disabled={isSubmitting || isDealLoading || !isTermsAccepted}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "ارسال برای تایید خریدار"
              )}
            </Button>
          </div>
        </>
      )}

      {(isPropertiesLoading ||
        (stageNumber === 2 && isDocumentRequirementsLoading)) && (
        <div
          style={{ display: "flex", justifyContent: "center", padding: "20px" }}
        >
          <CircularProgress size={24} />
        </div>
      )}

      {!isPropertiesLoading &&
        !isDocumentRequirementsLoading &&
        visibleStageProperties.length > 0 && (
          <div className={styles.propertiesBox}>
            <div className={styles.propertiesHeader}>
              <div className={styles.propertiesTitle}>
                {stageNumber === 2 ? "بارگذاری اسناد" : subCategoryName}
              </div>
              {stageNumber === 2 ? (
                <div className={styles.propertiesDescription}>
                  فایل‌های مورد نیاز برای بارگذاری را انتخاب کنید
                </div>
              ) : (
                subCategoryDescription && (
                  <div className={styles.propertiesDescription}>
                    {subCategoryDescription}
                  </div>
                )
              )}
            </div>

            <div className={styles.propertiesGrid}>
              {stageNumber === 2
                ? documentRequirements.map(renderDocumentRequirement)
                : stageProperties.map(renderProperty)}
            </div>
          </div>
        )}

      {stageNumber !== 3 && !isPropertiesLoading && selectedSubCategoryId && (
        <>
          {stageNumber === 1 && (
            <div className={styles.financialSection}>
              <div className={styles.sectionTitle}>جزئیات مالی معامله</div>

              <div className={styles.fieldWrapper}>
                <ListInput
                  title="مبلغ واریزی به حساب امانی (ریال)"
                  placeholder="مبلغ واریزی به حساب امانی"
                  value={escrowAmount}
                  onChange={setEscrowAmount}
                  valueType="number"
                />
                <div className={styles.fieldDescription}>
                  مبلغی که خریدار در ابتدای کار به حساب امانی واریز می‌کند
                </div>
              </div>

              <div className={styles.fieldWrapper}>
                <div className={styles.radioQuestion}>
                  آیا این مبلغ شامل کل هزینه معامله است؟
                </div>
                <div className={styles.radioOptions}>
                  <RadioButton
                    title="بله، کل هزینه معامله"
                    name="is-total-cost"
                    value="yes"
                    checked={isTotalCost === "yes"}
                    onChange={() => setIsTotalCost("yes")}
                  />
                  <RadioButton
                    title="خیر، فقط بخشی از هزینه معامله"
                    name="is-total-cost"
                    value="no"
                    checked={isTotalCost === "no"}
                    onChange={() => setIsTotalCost("no")}
                  />
                </div>
              </div>

              {isTotalCost === "no" && (
                <div className={styles.remainingCostBox}>
                  <div className={styles.fieldWrapper}>
                    <ListInput
                      title="مبلغ نهایی کل معامله (ریال)"
                      placeholder="مجموع کل هزینه معامله"
                      value={totalTransactionAmount}
                      onChange={setTotalTransactionAmount}
                      valueType="number"
                    />
                    <div className={styles.fieldDescription}>
                      مجموع کل هزینه معامله شامل پرداخت اولیه در پلتفرم +
                      پرداخت‌های خارج از حساب امانی
                    </div>
                  </div>

                  <Dropdown
                    title="شیوه پرداخت باقی‌مانده هزینه"
                    placeholder="انتخاب کنید"
                    options={[
                      { label: "پرداخت نقدی/کارت‌به‌کارت", slug: "Cash" },
                      {
                        label: "واریز به حساب امانی در مرحله بعدی",
                        slug: "Escrow",
                      },
                      { label: "ارائه چک صیادی", slug: "Cheque" },
                      { label: "تهاتر یا معاوضه", slug: "Change" },
                    ]}
                    onChange={setPaymentMethod}
                    initialSlug={paymentMethod}
                  />

                  <ListInput
                    textarea
                    title="توضیحات شیوه پرداخت"
                    placeholder="مثال: باقی مبلغ هنگام تنظیم سند رسمی در دفترخانه دریافت می‌شود"
                    value={paymentDescription}
                    onChange={setPaymentDescription}
                  />
                </div>
              )}
            </div>
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
        </>
      )}
    </div>
  )
}

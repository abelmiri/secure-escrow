"use client"

import React, { useContext, useEffect, useRef, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import RadioButton from "@/components/RadioButton/RadioButton"
import Dropdown from "@/components/DropDownInput/DropDownInput"
import ListInput from "@/components/ListInput/ListInput"
import DatePicker from "@/components/DatePicker/DatePicker"
import styles from "./styles/TransactionFormDetails.module.scss"
import { Button, CircularProgress } from "@mui/material"
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined"
import { useCategories } from "@/hooks/deals/useCategories"
import { useSubCategories } from "@/hooks/deals/useSubCategories"
import type { Property } from "@/hooks/deals/useSubCategories"
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

const roles = [
  { title: "خریدار", value: "customer" },
  { title: "فروشنده", value: "beneficiary" },
  { title: "کارگزار (واسط)", value: "broker" },
]

type PropertyInputValue =
  | File[]
  | string
  | number
  | boolean
  | Date
  | null
  | undefined

export default function TransactionFormDetails({
  stageNumber = 1,
  dealId,
  onDealCreated,
  onPrevious,
}: {
  stageNumber?: number
  dealId?: number | null
  onDealCreated?: (dealId: number, itemId: number | null) => void
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

  const stageProperties = properties.filter(
    (prop) => prop.display_page === stageNumber,
  )

  const visibleStageProperties =
    stageNumber === 2 ? documentRequirements : stageProperties

  console.log("visibleStageProperties", visibleStageProperties)
  
  const getSelectedFiles = (value: unknown): File[] => {
    if (Array.isArray(value)) {
      return value.filter((item): item is File => item instanceof File)
    }
    if (value instanceof File) return [value]
    return []
  }

  const handlePropertyChange = (
    propertyName: string,
    value: PropertyInputValue,
  ) => {
    setPropertyValues((prev) => ({ ...prev, [propertyName]: value }))
  }

  const getStringPropertyValue = (propertyName: string) => {
    const value = propertyValues[propertyName]
    return typeof value === "string" ? value : ""
  }

  const handleContinue = async () => {
    if (!selectedSubCategoryId || !authState.user) return

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
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error processing deal stage:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isHalfWidth = (propertyName: string) => {
    return propertyName === "quantity" || propertyName === "weight"
  }

  const renderDocumentRequirement = (requirement: DocumentRequirement) => {
    const requirementKey =
      requirement.document_type_code || requirement.slug || String(requirement.id)
    const requirementName = requirement.title || requirement.name || requirementKey
    const isRequired =
      requirement.is_required ?? requirement.requirement_type !== "optional"
    const maxFiles = requirement.files_max || 3
    const minFiles = requirement.files_min || 0
    const selectedFiles = getSelectedFiles(propertyValues[requirementKey])
    const accept = requirement.file_types?.length
      ? requirement.file_types
          .map((type) => `.${type.replace(/^\./, "")}`)
          .join(",")
      : undefined

    return (
      <div key={requirementKey} className={styles.fullWidth}>
        <div className={styles.radioQuestion}>
          {requirementName}
          {isRequired && " *"}
        </div>
        {(requirement.description || requirement.requirement_type) && (
          <div className={styles.fieldDescription}>
            {requirement.description ||
              (requirement.requirement_type === "conditional"
                ? "این سند در شرایط خاص ضروری است"
                : requirement.requirement_type === "optional"
                  ? "این سند اختیاری است"
                  : "این سند الزامی است")}
          </div>
        )}
        <div
          className={styles.fileUploadCard}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            const files = Array.from(e.dataTransfer.files).slice(0, maxFiles)
            handlePropertyChange(requirementKey, files)
          }}
        >
          <input
            id={`file-upload-${requirementKey}`}
            type="file"
            multiple
            accept={accept}
            hidden
            onChange={(e) => {
              const files = e.target.files
              handlePropertyChange(
                requirementKey,
                files ? Array.from(files).slice(0, maxFiles) : [],
              )
            }}
          />
          <label
            htmlFor={`file-upload-${requirementKey}`}
            className={styles.fileUploadLabel}
          >
            <FileUploadOutlinedIcon className={styles.fileUploadIcon} />
            <div className={styles.fileUploadText}>
              فایل‌ها را اینجا بکشید یا کلیک کنید
            </div>
            <span className={styles.fileUploadButton}>انتخاب فایل</span>
            <span className={styles.fileUploadHint}>
              حداقل {minFiles} و حداکثر {maxFiles} فایل
            </span>
          </label>
        </div>
        {selectedFiles.length > 0 && (
          <div className={styles.selectedFiles}>
            {selectedFiles.map((file: File, index: number) => (
              <div key={index} className={styles.fileName}>
                {file.name}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderProperty = (prop: Property) => {
    const selectedFiles = getSelectedFiles(propertyValues[prop.slug])

    return (
      <div
        key={prop.slug}
        className={isHalfWidth(prop.slug) ? "" : styles.fullWidth}
      >
        {prop.field_type === "select" || prop.field_type === "dropdown" ? (
          <Dropdown
            title={prop.name}
            placeholder={`انتخاب ${prop.name}`}
            options={prop.options?.map((opt) => {
              if (typeof opt === "string") {
                return { label: opt, slug: opt }
              }
              return { label: opt.label, slug: opt.value }
            })}
            onChange={(val) => handlePropertyChange(prop.slug, val)}
            required={prop.is_required}
          />
        ) : prop.field_type === "date" ? (
          <DatePicker
            title={prop.name}
            placeholder={`انتخاب ${prop.name}`}
            value={getStringPropertyValue(prop.slug)}
            onChange={(val) => handlePropertyChange(prop.slug, val)}
            required={prop.is_required}
          />
        ) : prop.field_type === "bool" ? (
          <div>
            <div className={styles.radioQuestion}>{prop.name}</div>
            <div className={styles.radioOptions}>
              <RadioButton
                title="دارد"
                name={prop.slug}
                value="true"
                checked={propertyValues[prop.slug] === true}
                onChange={() => handlePropertyChange(prop.slug, true)}
              />
              <RadioButton
                title="ندارد"
                name={prop.slug}
                value="false"
                checked={propertyValues[prop.slug] === false}
                onChange={() => handlePropertyChange(prop.slug, false)}
              />
            </div>
          </div>
        ) : prop.field_type === "file" ? (
          <div>
            <div className={styles.radioQuestion}>{prop.name}</div>
            <div
              className={styles.fileUploadCard}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                const files = Array.from(e.dataTransfer.files).slice(0, 3)
                handlePropertyChange(prop.slug, files)
              }}
            >
              <input
                id={`file-upload-${prop.slug}`}
                type="file"
                multiple
                hidden
                onChange={(e) => {
                  const files = e.target.files
                  handlePropertyChange(
                    prop.slug,
                    files ? Array.from(files).slice(0, 3) : [],
                  )
                }}
              />
              <label
                htmlFor={`file-upload-${prop.slug}`}
                className={styles.fileUploadLabel}
              >
                <FileUploadOutlinedIcon className={styles.fileUploadIcon} />
                <div className={styles.fileUploadText}>
                  فایل‌ها را اینجا بکشید یا کلیک کنید
                </div>
                <span className={styles.fileUploadButton}>انتخاب فایل</span>
                <span className={styles.fileUploadHint}>حداکثر 3 فایل</span>
              </label>
            </div>
            {selectedFiles.length > 0 && (
              <div className={styles.selectedFiles}>
                {selectedFiles.map((file: File, index: number) => (
                  <div key={index} className={styles.fileName}>
                    {file.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <ListInput
            title={prop.name}
            placeholder={prop.unit ? `${prop.name} (${prop.unit})` : prop.name}
            value={getStringPropertyValue(prop.slug)}
            onChange={(val) => handlePropertyChange(prop.slug, val)}
            valueType={prop.field_type === "integer" ? "number" : "string"}
            required={prop.is_required}
            regex={
              prop.regex_pattern ? new RegExp(prop.regex_pattern) : undefined
            }
          />
        )}
      </div>
    )
  }

  const headerTitle =
    stageNumber === 2 ? "اطلاعات طرفین و اسناد" : "جزئیات تراکنش"
  const headerDescription =
    stageNumber === 2
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

          {/* <div className={styles.radioQuestion}>آیا نماینده فروشنده هستید؟</div> */}
          {/* <div className={styles.radioOptions}>
            <RadioButton
              title="خیر، خود فروشنده هستم"
              name="seller-rep"
              value="no"
              checked={isSellerRepresentative === "no"}
              onChange={() => setIsSellerRepresentative("no")}
            />
            <RadioButton
              title="بله، نماینده فروشنده هستم"
              name="seller-rep"
              value="yes"
              checked={isSellerRepresentative === "yes"}
              onChange={() => setIsSellerRepresentative("yes")}
            />
          </div> */}
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

      {!isPropertiesLoading && selectedSubCategoryId && (
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
                      { label: "پرداخت نقدی/کارت‌به‌کارت", slug: "cash" },
                      {
                        label: "واریز به حساب امانی در مرحله بعدی",
                        slug: "next_escrow",
                      },
                      { label: "ارائه چک صیادی", slug: "check" },
                      { label: "تهاتر یا معاوضه", slug: "barter" },
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
                disabled={isSubmitting}
              >
                قبلی
              </Button>
            )}
            <Button
              className={styles.buttonPrimary}
              variant="contained"
              onClick={handleContinue}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "ادامه"
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

"use client"

import { FormEvent, useState } from "react"
import { Box, Button, TextField, Typography } from "@mui/material"
import Dropdown from "@/components/DropDownInput/DropDownInput"
import {
  PartnershipRequestPayload,
  PartnershipRequestResponse,
  usePartnershipRequest,
} from "@/hooks/partners/usePartnershipRequest"
import styles from "./page.module.scss"

type FormState = {
  name: string
  full_name: string
  phone_number: string
  email: string
  business_type: string
  description: string
}

type SubmissionResult = {
  trackingId: string | number | null
}

const initialFormState: FormState = {
  name: "",
  full_name: "",
  phone_number: "",
  email: "",
  business_type: "",
  description: "",
}

const businessTypeOptions = [
  { label: "شرکت یا سازمان", slug: "organization" },
  { label: "فروشگاه اینترنتی", slug: "online_shop" },
  { label: "مارکت‌پلیس (Marketplace)", slug: "marketplace" },
  { label: "پلتفرم ارائه خدمات", slug: "service_platform" },
  { label: "حمل‌ونقل و لجستیک", slug: "transportation_logistics" },
  { label: "املاک و مستغلات", slug: "real_estate" },
  { label: "خودرو و وسایل نقلیه", slug: "automotive" },
  { label: "مصالح ساختمانی و پروژه‌های عمرانی", slug: "construction" },
  { label: "صنعت، تولید و مواد اولیه", slug: "manufacturing" },
  { label: "عمده‌فروشی (B2B)", slug: "wholesale" },
  { label: "فناوری اطلاعات و نرم‌افزار", slug: "information_technology" },
  { label: "سلامت و خدمات پزشکی", slug: "healthcare" },
  { label: "آموزش", slug: "education" },
  { label: "گردشگری و سفر", slug: "travel_tourism" },
  { label: "سایر", slug: "other" },
]

const requiredFields: Array<keyof FormState> = [
  "name",
  "full_name",
  "phone_number",
  "email",
  "business_type",
]

const successMessage =
  "درخواست همکاری شما با موفقیت ثبت شد. تیم امان‌یار پس از بررسی اطلاعات برای هماهنگی جلسه با شما تماس خواهد گرفت."

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const isFormComplete = (formData: FormState) =>
  requiredFields.every((field) => formData[field].trim()) &&
  emailRegex.test(formData.email.trim())

const getTrackingId = (response: PartnershipRequestResponse) => {
  return (
    response.tracking_id ??
    response.tracking_code ??
    response.reference_id ??
    response.code ??
    response.id ??
    response.data?.tracking_id ??
    response.data?.tracking_code ??
    response.data?.reference_id ??
    response.data?.code ??
    response.data?.id ??
    null
  )
}

export default function PartnersRequestPage() {
  const { submitPartnershipRequest, isSubmitting } = usePartnershipRequest()
  const [formData, setFormData] = useState<FormState>(initialFormState)
  const [submissionResult, setSubmissionResult] =
    useState<SubmissionResult | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Array<keyof FormState>>([])
  const isSubmitDisabled = isSubmitting || !isFormComplete(formData)

  const updateField = (field: keyof FormState, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }))
    setFieldErrors((current) => current.filter((item) => item !== field))
    setSubmissionResult(null)
  }

  const validateForm = () => {
    const errors = requiredFields.filter((field) => !formData[field].trim())

    if (formData.email.trim() && !emailRegex.test(formData.email.trim())) {
      errors.push("email")
    }

    setFieldErrors(errors)
    return errors.length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmissionResult(null)

    if (!validateForm()) return

    const payload: PartnershipRequestPayload = {
      name: formData.name.trim(),
      full_name: formData.full_name.trim(),
      phone_number: formData.phone_number.trim(),
      email: formData.email.trim(),
      business_type: formData.business_type,
      description: formData.description.trim() || null,
    }

    try {
      const response = await submitPartnershipRequest(payload)
      setSubmissionResult({ trackingId: getTrackingId(response) })
      setFormData(initialFormState)
    } catch {
      // Keep entered data intact; request layer already shows the failure toast.
    }
  }

  const renderInput = ({
    label,
    field,
    placeholder,
    type = "text",
    multiline = false,
    fullWidth = false,
  }: {
    label: string
    field: keyof FormState
    placeholder: string
    type?: string
    multiline?: boolean
    fullWidth?: boolean
  }) => (
    <Box className={`${styles.field} ${fullWidth ? styles.fullWidth : ""}`}>
      <Typography component="label" className={styles.label}>
        {label}
      </Typography>
      <TextField
        fullWidth
        type={type}
        value={formData[field]}
        onChange={(event) => updateField(field, event.target.value)}
        placeholder={placeholder}
        className={styles.input}
        error={fieldErrors.includes(field)}
        multiline={multiline}
        minRows={multiline ? 4 : undefined}
      />
      {fieldErrors.includes(field) && (
        <Typography className={styles.errorText}>
          {field === "email" && formData.email.trim()
            ? "ایمیل وارد شده معتبر نیست"
            : "این فیلد الزامی است"}
        </Typography>
      )}
    </Box>
  )

  return (
    <main className={styles.page}>
      <Box className={styles.hero}>
        <Typography component="h1" className={styles.title}>
          درخواست همکاری و استفاده از سرویس امان‌یار
        </Typography>
        <Typography className={styles.description}>
          امان‌یار زیرساخت پرداخت امانی و معامله امن را در اختیار شرکت‌ها،
          پلتفرم‌ها و بازارگاه‌ها و انواع مختلف کسب‌وکارها قرار می‌دهد.
        </Typography>
      </Box>

      <Box component="form" className={styles.formCard} onSubmit={handleSubmit}>
        <Box className={styles.formHeader}>
          <Typography component="h2" className={styles.formTitle}>
            ثبت اطلاعات تماس
          </Typography>
          <Typography className={styles.formDescription}>
            برای درخواست همکاری، ثبت نام به عنوان کارگزار و همچنین استفاده از
            حساب و پرداخت امانی و دیگر سرویس‌های امان یار، اطلاعات خود را ثبت
            کنید. همکاران ما در سریع ترین زمان ممکن با شما تماس خواهند گرفت و
            درخواست شما را پیگیری خواهند کرد.
          </Typography>
        </Box>

        <Box className={styles.formGrid}>
          {renderInput({
            label: "نام کسب و کار",
            field: "name",
            placeholder: "لطفا نام کسب و کار خود را وارد کنید",
          })}
          {renderInput({
            label: "نام و نام خانوادگی درخواست دهنده",
            field: "full_name",
            placeholder: "لطفا نام و نام خانوادگی خود را ثبت کنید",
          })}
          {renderInput({
            label: "شماره تماس",
            field: "phone_number",
            placeholder:
              "لطفا شماره تماسی را وارد کنید که به سادگی در دسترس باشد",
            type: "tel",
          })}
          {renderInput({
            label: "ایمیل",
            field: "email",
            placeholder:
              "لطفا ایمیلی را وارد کرده که اطلاعات مربوطه به آن ارسال گردد",
            type: "email",
          })}

          <Box className={`${styles.field} ${styles.fullWidth}`}>
            <Dropdown
              title="نوع کسب و کار"
              placeholder="لطفا یک دسته‌بندی انتخاب کنید"
              options={businessTypeOptions}
              initialSlug={formData.business_type}
              onChange={(value) => updateField("business_type", value)}
              error={fieldErrors.includes("business_type")}
            />
            {fieldErrors.includes("business_type") && (
              <Typography className={styles.errorText}>
                این فیلد الزامی است
              </Typography>
            )}
          </Box>

          {renderInput({
            label: "توضیحات تکمیلی",
            field: "description",
            placeholder:
              "در صورت نیاز، لطفا هرگونه توضیح تکمیلی را در این بخش بنویسید.",
            multiline: true,
            fullWidth: true,
          })}
        </Box>

        {submissionResult && (
          <Box className={styles.successBox}>
            <Typography className={styles.successText}>
              {successMessage}
            </Typography>
            <Typography className={styles.trackingText}>
              شناسه پیگیری: {submissionResult.trackingId ?? "دریافت نشد"}
            </Typography>
          </Box>
        )}

        <Button
          type="submit"
          disabled={isSubmitDisabled}
          className={styles.submitButton}
        >
          {isSubmitting ? "در حال ثبت..." : "ثبت درخواست همکاری"}
        </Button>
      </Box>
    </main>
  )
}

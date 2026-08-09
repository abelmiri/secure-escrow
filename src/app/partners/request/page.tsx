"use client"

import { FormEvent, useState } from "react"
import { Box, Button, Typography } from "@mui/material"
import Dropdown from "@/components/DropDownInput/DropDownInput"
import ListInput from "@/components/ListInput/ListInput"
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

const fieldLabels: Record<keyof FormState, string> = {
  name: "نام کسب و کار",
  full_name: "نام و نام خانوادگی درخواست دهنده",
  phone_number: "شماره تماس",
  email: "ایمیل",
  business_type: "نوع کسب و کار",
  description: "توضیحات تکمیلی",
}

const successMessage =
  "درخواست همکاری شما با موفقیت ثبت شد. تیم امان‌یار پس از بررسی اطلاعات برای هماهنگی جلسه با شما تماس خواهد گرفت."

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const iranMobileRegex = /^09[0-9]{9}$/

const normalizeDigits = (value: string) =>
  value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))

const getTrackingId = (response: PartnershipRequestResponse) => {
  return (
    response.slug ??
    response.tracking_id ??
    response.tracking_code ??
    response.reference_id ??
    response.code ??
    response.id ??
    response.data?.slug ??
    response.data?.tracking_id ??
    response.data?.tracking_code ??
    response.data?.reference_id ??
    response.data?.code ??
    response.data?.id ??
    null
  )
}

const getFieldErrorLabel = (field: keyof FormState, formData: FormState) => {
  if (field === "email" && formData.email.trim()) {
    return "ایمیل معتبر"
  }

  if (field === "phone_number" && formData.phone_number.trim()) {
    return "شماره تماس معتبر"
  }

  return fieldLabels[field]
}

export default function PartnersRequestPage() {
  const { submitPartnershipRequest, isSubmitting } = usePartnershipRequest()
  const [formData, setFormData] = useState<FormState>(initialFormState)
  const [submissionResult, setSubmissionResult] =
    useState<SubmissionResult | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Array<keyof FormState>>([])

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

    const normalizedPhoneNumber = normalizeDigits(formData.phone_number.trim())
    if (normalizedPhoneNumber && !iranMobileRegex.test(normalizedPhoneNumber)) {
      errors.push("phone_number")
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
      phone_number: normalizeDigits(formData.phone_number.trim()),
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
    multiline = false,
    fullWidth = false,
    regex,
    rejectPersianDigits = false,
  }: {
    label: string
    field: keyof FormState
    placeholder: string
    multiline?: boolean
    fullWidth?: boolean
    regex?: RegExp
    rejectPersianDigits?: boolean
  }) => (
    <Box className={`${styles.field} ${fullWidth ? styles.fullWidth : ""}`}>
      <ListInput
        title={label}
        placeholder={placeholder}
        value={formData[field]}
        onChange={(value) => updateField(field, value)}
        valueType="string"
        textarea={multiline}
        regex={regex}
        rejectPersianDigits={rejectPersianDigits}
        required={requiredFields.includes(field)}
        error={fieldErrors.includes(field)}
      />
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

      <Box
        component="form"
        className={styles.formCard}
        onSubmit={handleSubmit}
        noValidate
      >
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
            regex: iranMobileRegex,
            rejectPersianDigits: true,
          })}
          {renderInput({
            label: "ایمیل",
            field: "email",
            placeholder:
              "لطفا ایمیلی را وارد کرده که اطلاعات مربوطه به آن ارسال گردد",
            regex: emailRegex,
            rejectPersianDigits: true,
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

        {fieldErrors.length > 0 && (
          <Box className={styles.validationBox}>
            <Typography className={styles.validationTitle}>
              فیلدهای زیر را تکمیل کنید:
            </Typography>
            <ul className={styles.validationList}>
              {fieldErrors.map((field) => (
                <li key={field}>{getFieldErrorLabel(field, formData)}</li>
              ))}
            </ul>
          </Box>
        )}

        {submissionResult && (
          <Box className={styles.successBox}>
            <Typography className={styles.successText}>
              {successMessage}
            </Typography>
            <Typography className={styles.trackingText}>
              شماره پیگیری: {submissionResult.trackingId ?? "دریافت نشد"}
            </Typography>
          </Box>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting ? "در حال ثبت..." : "ثبت درخواست همکاری"}
        </Button>
      </Box>
    </main>
  )
}

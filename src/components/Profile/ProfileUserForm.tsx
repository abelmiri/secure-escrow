"use client"

import { useEffect, useRef, useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material"
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined"
import PersonOutlineIcon from "@mui/icons-material/PersonOutline"
import useUser from "@/context/auth/hooks/useUser"
import type { ProfileUpdatePayload, UserType } from "@/context/auth/AuthType"
import Dropdown from "@/components/DropDownInput/DropDownInput"
import { useLocation } from "@/hooks/auth/useLocation"
import { getRequestErrorMessage } from "@/lib/errorHelpers"
import { isValidNationalCode } from "@/lib/validation"
import type { ProfileStep } from "./Profile"
import styles from "./styles/ProfileUserForm.module.scss"

type FormValues = {
  nationalId: string
  sheba: string
  firstName: string
  lastName: string
  email: string
  province: string
  city: string
  postalCode: string
  address: string
}

type DetailValues = Omit<FormValues, "nationalId" | "sheba">
type DetailField = keyof DetailValues

const detailFields: DetailField[] = [
  "firstName",
  "lastName",
  "email",
  "province",
  "city",
  "postalCode",
  "address",
]

const stepLabels = ["کد ملی", "شماره شبا", "اطلاعات تکمیلی"] as const

function normalizeDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 1728))
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 1584))
    .trim()
}

function normalizeShaba(value: string): string {
  return normalizeDigits(value).replace(/\s/g, "").toUpperCase()
}

function formValuesFromUser(user: UserType | null | undefined): FormValues {
  return {
    nationalId: user?.national_code ?? "",
    sheba: user?.shaba_number ?? "",
    firstName: user?.first_name ?? "",
    lastName: user?.last_name ?? "",
    email: user?.email ?? "",
    province: user?.province == null ? "" : String(user.province),
    city: user?.city == null ? "" : String(user.city),
    postalCode: user?.postal_code ?? "",
    address: user?.full_address ?? "",
  }
}

function normalizedDetails(values: FormValues): DetailValues {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim(),
    province: values.province,
    city: values.city,
    postalCode: normalizeDigits(values.postalCode),
    address: values.address.trim(),
  }
}

function requestErrorMessage(error: unknown): string {
  const response =
    error && typeof error === "object"
      ? (error as { status?: number; data?: unknown })
      : {}
  return getRequestErrorMessage({
    status: response.status,
    data: response.data,
  })
}

export default function ProfileUserForm({
  activeStep,
  onStepChange,
}: {
  activeStep: ProfileStep
  onStepChange: (step: ProfileStep) => void
}) {
  const { user, updateUser } = useUser()
  const {
    provinces,
    cities,
    fetchCities,
    isLoadingProvinces,
    isLoadingCities,
  } = useLocation()
  const [formData, setFormData] = useState<FormValues>(() =>
    formValuesFromUser(user),
  )
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormValues | "image", string>>
  >({})
  const [message, setMessage] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const hydratedActorRef = useRef("")
  const savedDetailsRef = useRef<DetailValues>(
    normalizedDetails(formValuesFromUser(user)),
  )

  useEffect(() => {
    if (!user || hydratedActorRef.current === String(user.actor_id)) return
    hydratedActorRef.current = String(user.actor_id)
    const values = formValuesFromUser(user)
    setFormData(values)
    savedDetailsRef.current = normalizedDetails(values)
    setErrors({})
    setMessage("")
    setSelectedImage(null)
    setImagePreview(null)
    if (user.province) fetchCities(Number(user.province))
  }, [user, fetchCities])

  const maxAvailableStep: ProfileStep = !user?.national_code_verified
    ? 1
    : !user.shaba_number_verified
      ? 2
      : 3

  const changeField = (field: keyof FormValues, value: string) => {
    setFormData((previous) => ({ ...previous, [field]: value }))
    setErrors((previous) => ({ ...previous, [field]: undefined }))
    setMessage("")
  }

  const submitVerification = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user || isSaving || activeStep === 3) return

    const isNationalCode = activeStep === 1
    const verified = isNationalCode
      ? user.national_code_verified
      : user.shaba_number_verified
    if (verified) {
      onStepChange(isNationalCode ? 2 : 3)
      return
    }
    if (!isNationalCode && !user.national_code_verified) return

    const nationalCode = normalizeDigits(formData.nationalId)
    const shaba = normalizeShaba(formData.sheba)
    if (isNationalCode && !isValidNationalCode(nationalCode)) {
      setErrors((previous) => ({
        ...previous,
        nationalId: "کد ملی معتبر وارد کنید",
      }))
      return
    }
    if (!isNationalCode && !/^IR\d{24}$/.test(shaba)) {
      setErrors((previous) => ({
        ...previous,
        sheba: "شماره شبا باید با IR شروع شود و ۲۴ رقم داشته باشد",
      }))
      return
    }

    const payload: ProfileUpdatePayload = isNationalCode
      ? { actor_id: user.actor_id, national_code: nationalCode }
      : { actor_id: user.actor_id, shaba_number: shaba }

    setIsSaving(true)
    setMessage("")
    try {
      const updatedUser = await updateUser({ data: payload, dontToast: true })
      const isNowVerified = isNationalCode
        ? updatedUser.national_code_verified
        : updatedUser.shaba_number_verified
      if (isNowVerified) {
        changeField(
          isNationalCode ? "nationalId" : "sheba",
          isNationalCode ? nationalCode : shaba,
        )
        onStepChange(isNationalCode ? 2 : 3)
      } else {
        setMessage("اطلاعات ثبت شد اما هنوز از سوی سامانه تأیید نشده است.")
      }
    } catch (error) {
      setMessage(requestErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  const changeImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    event.target.value = ""
    if (
      !["image/jpeg", "image/png"].includes(file.type) ||
      file.size > 2 * 1024 * 1024
    ) {
      setSelectedImage(null)
      setImagePreview(null)
      setErrors((previous) => ({
        ...previous,
        image: "تصویر باید JPG یا PNG و حداکثر ۲ مگابایت باشد",
      }))
      return
    }
    setErrors((previous) => ({ ...previous, image: undefined }))
    setSelectedImage(file)
    const reader = new FileReader()
    reader.onload = () => setImagePreview(String(reader.result))
    reader.readAsDataURL(file)
  }

  const submitDetails = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user || isSaving || activeStep !== 3) return

    const details = normalizedDetails(formData)
    const nextErrors: typeof errors = {}
    if (
      details.email !== savedDetailsRef.current.email &&
      details.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)
    ) {
      nextErrors.email = "آدرس ایمیل معتبر نیست"
    }
    if (
      details.postalCode !== savedDetailsRef.current.postalCode &&
      details.postalCode &&
      !/^\d{10}$/.test(details.postalCode)
    ) {
      nextErrors.postalCode = "کد پستی باید ۱۰ رقم باشد"
    }
    if (details.city && !details.province) {
      nextErrors.city = "ابتدا استان را انتخاب کنید"
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }
    setErrors({})

    const payload: ProfileUpdatePayload = { actor_id: user.actor_id }
    for (const field of detailFields) {
      if (details[field] === savedDetailsRef.current[field]) continue
      switch (field) {
        case "firstName":
          payload.first_name = details[field]
          break
        case "lastName":
          payload.last_name = details[field]
          break
        case "email":
          payload.email = details[field]
          break
        case "province":
          payload.province = details[field] ? Number(details[field]) : null
          break
        case "city":
          payload.city = details[field] ? Number(details[field]) : null
          break
        case "postalCode":
          payload.postal_code = details[field]
          break
        case "address":
          payload.full_address = details[field]
          break
      }
    }
    if (selectedImage) payload.image = selectedImage
    if (Object.keys(payload).length === 1) {
      setMessage("تغییری برای ذخیره وجود ندارد.")
      return
    }

    setIsSaving(true)
    setMessage("")
    setUploadProgress(selectedImage ? 0 : null)
    try {
      const updatedUser = await updateUser({
        data: payload,
        progress: selectedImage ? setUploadProgress : undefined,
        dontToast: true,
      })
      const savedValues = formValuesFromUser(updatedUser)
      savedDetailsRef.current = normalizedDetails(savedValues)
      setFormData((previous) => ({
        ...previous,
        ...normalizedDetails(savedValues),
      }))
      setSelectedImage(null)
      setImagePreview(null)
      setMessage("اطلاعات با موفقیت ذخیره شد.")
    } catch (error) {
      setMessage(requestErrorMessage(error))
    } finally {
      setIsSaving(false)
      setUploadProgress(null)
    }
  }

  const renderField = (
    label: string,
    field: keyof FormValues,
    options: {
      ltr?: boolean
      readOnly?: boolean
      placeholder?: string
      required?: boolean
    } = {},
  ) => (
    <Box className={styles.fieldWrapper}>
      <Typography
        component="label"
        htmlFor={`profile-${field}`}
        className={styles.label}
      >
        {label}
        {options.required && <span className={styles.requiredMark}> *</span>}
      </Typography>
      <TextField
        id={`profile-${field}`}
        fullWidth
        name={field}
        value={
          options.readOnly
            ? field === "nationalId"
              ? (user?.national_code ?? "")
              : (user?.shaba_number ?? "")
            : formData[field]
        }
        onChange={(event) => changeField(field, event.target.value)}
        placeholder={options.placeholder}
        required={options.required}
        slotProps={{
          htmlInput: {
            readOnly: options.readOnly,
            dir: options.ltr ? "ltr" : "rtl",
          },
        }}
        className={`${styles.inputField} ${options.readOnly ? styles.readOnlyInput : ""}`}
        error={!!errors[field]}
      />
      {errors[field] && (
        <Typography className={styles.errorText}>{errors[field]}</Typography>
      )}
    </Box>
  )

  return (
    <Box id="personal-profile-form" className={styles.formContainer}>
      <Box className={styles.sectionHeader}>
        <Typography className={styles.sectionTitle}>اطلاعات شخصی</Typography>
        <Typography className={styles.sectionSubtitle}>
          اطلاعات خود را از طریق مراحل زیر تکمیل و تأیید کنید
        </Typography>
      </Box>

      <Box className={styles.profileSteps} aria-label="مراحل تکمیل پروفایل">
        {stepLabels.map((label, index) => {
          const step = (index + 1) as ProfileStep
          const complete =
            step === 1
              ? !!user?.national_code_verified
              : step === 2
                ? !!user?.shaba_number_verified
                : false
          return (
            <Button
              key={step}
              type="button"
              className={`${styles.profileStep} ${activeStep === step ? styles.activeProfileStep : ""}`}
              disabled={isSaving || step > maxAvailableStep}
              aria-current={activeStep === step ? "step" : undefined}
              onClick={() => {
                onStepChange(step)
                setMessage("")
                setErrors({})
              }}
            >
              <span className={styles.stepNumber}>{step}</span>
              <span>{label}</span>
              {complete && (
                <span className={styles.stepComplete}>تأیید شده</span>
              )}
            </Button>
          )
        })}
      </Box>

      {activeStep < 3 ? (
        <Box component="form" onSubmit={submitVerification} noValidate>
          <Typography className={styles.stepDescription}>
            {activeStep === 1
              ? "کد ملی باید متعلق به صاحب شماره موبایل حساب باشد."
              : "شماره شبا باید متعلق به صاحب حساب باشد."}
          </Typography>
          <Box className={styles.verificationField}>
            {activeStep === 1
              ? renderField("کد ملی", "nationalId", {
                  ltr: true,
                  readOnly: user?.national_code_verified,
                  required: true,
                  placeholder: "۱۲۳۴۵۶۷۸۹۰",
                })
              : renderField("شماره شبا", "sheba", {
                  ltr: true,
                  readOnly: user?.shaba_number_verified,
                  required: true,
                  placeholder: "IR۱۲۳۴۵۶۷۸۹۰۱۲۳۴۵۶۷۸۹۰۱۲۳۴",
                })}
          </Box>
          {message && (
            <Typography role="alert" className={styles.formMessage}>
              {message}
            </Typography>
          )}
          <Box className={styles.submitSection}>
            <Button
              type="submit"
              variant="contained"
              className={styles.submitButton}
              disabled={isSaving}
            >
              {isSaving ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                  activeStep === 1
                    ? user?.national_code_verified
                    : user?.shaba_number_verified
                ) ? (
                "مرحله بعد"
              ) : (
                "تأیید و ادامه"
              )}
            </Button>
          </Box>
        </Box>
      ) : (
        <Box component="form" onSubmit={submitDetails} noValidate>
          <Typography className={styles.stepDescription}>
            این بخش اختیاری است؛ اطلاعات موجود از پروفایل شما دریافت شده است.
          </Typography>
          <Box className={styles.avatarSection}>
            <Box className={styles.uploadInfo}>
              <input
                type="file"
                accept="image/jpeg,image/png"
                id="avatar-upload"
                hidden
                onChange={changeImage}
              />
              <label htmlFor="avatar-upload">
                <Button
                  variant="outlined"
                  component="span"
                  className={styles.uploadButton}
                  startIcon={<FileUploadOutlinedIcon />}
                  disabled={isSaving}
                >
                  آپلود عکس
                </Button>
              </label>
              <Typography className={styles.uploadText}>
                حداکثر حجم ۲ مگابایت، JPG یا PNG
              </Typography>
              {errors.image && (
                <Typography className={styles.errorText}>
                  {errors.image}
                </Typography>
              )}
              {uploadProgress !== null && (
                <Box className={styles.progressContainer}>
                  <Box
                    className={styles.progressBar}
                    style={{ width: `${uploadProgress}%` }}
                  />
                </Box>
              )}
            </Box>
            <Avatar
              className={styles.avatar}
              src={imagePreview || user?.image || undefined}
            >
              {!imagePreview && !user?.image && (
                <PersonOutlineIcon fontSize="inherit" />
              )}
            </Avatar>
          </Box>
          <Box className={styles.gridContainer}>
            {renderField("نام", "firstName")}
            {renderField("نام خانوادگی", "lastName")}
            <Box className={styles.fieldWrapper}>
              <Typography className={styles.label}>شماره موبایل</Typography>
              <TextField
                fullWidth
                value={user?.mobile_number ?? ""}
                slotProps={{ htmlInput: { readOnly: true, dir: "ltr" } }}
                className={`${styles.inputField} ${styles.readOnlyInput}`}
              />
            </Box>
            {renderField("آدرس ایمیل", "email", {
              ltr: true,
              placeholder: "example@email.com",
            })}
            <Dropdown
              title="استان"
              placeholder={
                isLoadingProvinces ? "در حال بارگذاری..." : "انتخاب استان"
              }
              options={provinces.map((province) => ({
                label: province.name,
                slug: String(province.id),
              }))}
              initialSlug={formData.province}
              onChange={(province) => {
                setFormData((previous) => ({ ...previous, province, city: "" }))
                setMessage("")
                fetchCities(Number(province))
              }}
            />
            <Dropdown
              title="شهر"
              placeholder={
                !formData.province
                  ? "ابتدا استان را انتخاب کنید"
                  : isLoadingCities
                    ? "در حال بارگذاری..."
                    : "انتخاب شهر"
              }
              options={cities.map((city) => ({
                label: city.name,
                slug: String(city.id),
              }))}
              initialSlug={formData.city}
              onChange={(city) => changeField("city", city)}
              disabled={!formData.province}
              error={!!errors.city}
            />
            {renderField("کد پستی", "postalCode", {
              ltr: true,
              placeholder: "۱۲۳۴۵۶۷۸۹۰",
            })}
            {renderField("آدرس کامل", "address", { placeholder: "آدرس کامل" })}
          </Box>
          {errors.city && (
            <Typography className={styles.errorText}>{errors.city}</Typography>
          )}
          {message && (
            <Typography role="status" className={styles.formMessage}>
              {message}
            </Typography>
          )}
          <Box className={styles.submitSection}>
            <Button
              type="submit"
              variant="contained"
              className={styles.submitButton}
              disabled={isSaving}
            >
              {isSaving ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                "ذخیره تغییرات"
              )}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}

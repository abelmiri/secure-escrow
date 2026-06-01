"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  InputAdornment,
} from "@mui/material"
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined"
import PersonOutlineIcon from "@mui/icons-material/PersonOutline"
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined"
import MailOutlineIcon from "@mui/icons-material/MailOutline"
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined"
import styles from "./styles/ProfileUserForm.module.scss"
import useUser from "@/context/auth/hooks/useUser"
import Dropdown from "@/components/DropDownInput/DropDownInput"
import { useLocation } from "@/hooks/auth/useLocation"

const CustomCheckIcon = ({
  className,
  sx,
}: {
  className?: string
  sx?: any
}) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      display: "inline-block",
      verticalAlign: "middle",
      flexShrink: 0,
      ...sx,
    }}
  >
    <path
      d="M18.1678 8.33332C18.5484 10.2011 18.2772 12.1428 17.3994 13.8348C16.5216 15.5268 15.0902 16.8667 13.3441 17.6311C11.5979 18.3955 9.64252 18.5381 7.80391 18.0353C5.9653 17.5325 4.35465 16.4145 3.24056 14.8678C2.12646 13.3212 1.57626 11.4394 1.68171 9.53615C1.78717 7.63294 2.54189 5.8234 3.82004 4.4093C5.09818 2.9952 6.82248 2.06202 8.70538 1.76537C10.5883 1.46872 12.516 1.82654 14.167 2.77916"
      stroke="currentColor"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 9.16659L10 11.6666L18.3333 3.33325"
      stroke="currentColor"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default function ProfileUserForm() {
  const { user, isLoggedIn, updateUser } = useUser()
  const {
    provinces,
    cities,
    fetchCities,
    isLoadingProvinces,
    isLoadingCities,
  } = useLocation()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nationalId: "",
    mobile: "",
    email: "",
    sheba: "",
    city: "",
    province: "",
    postalCode: "",
    address: "",
  })

  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (isLoggedIn && user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        nationalId: user.national_code || "",
        mobile: user.mobile_number || "",
        email: user.email || "",
        sheba: user.shaba_number || "",
        city: user.city?.toString() || "",
        province: user.province?.toString() || "",
        postalCode: user.postal_code || "",
        address: user.full_address || "",
      }))

      if (user.province) {
        fetchCities(Number(user.province))
      }
    }
  }, [isLoggedIn, user])

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (name: string, value: string) => {
    let error = ""
    switch (name) {
      case "nationalId":
        if (!value) break
        if (
          !/^\d{10}$/.test(
            value.replace(/[۰-۹]/g, (d) =>
              String.fromCharCode(d.charCodeAt(0) - 1728),
            ),
          )
        ) {
          error = "کد ملی باید ۱۰ رقم باشد"
        }
        break
      case "mobile":
        if (!value) break
        if (
          !/^(09|\+989)\d{9}$/.test(
            value.replace(/[۰-۹]/g, (d) =>
              String.fromCharCode(d.charCodeAt(0) - 1728),
            ),
          )
        ) {
          error = "شماره موبایل معتبر نیست"
        }
        break
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "آدرس ایمیل معتبر نیست"
        }
        break
      case "sheba":
        if (
          !/^IR\d{24}$/.test(
            value.replace(/[۰-۹]/g, (d) =>
              String.fromCharCode(d.charCodeAt(0) - 1728),
            ),
          )
        ) {
          error = "شماره شبا باید با IR شروع شده و ۲۴ رقم باشد"
        }
        break
      case "postalCode":
        if (
          !/^\d{10}$/.test(
            value.replace(/[۰-۹]/g, (d) =>
              String.fromCharCode(d.charCodeAt(0) - 1728),
            ),
          )
        ) {
          error = "کد پستی باید ۱۰ رقم باشد"
        }
        break
    }
    return error
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    const error = validate(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Perform final validation
    const newErrors: Record<string, string> = {}
    Object.keys(formData).forEach((key) => {
      const error = validate(key, formData[key as keyof typeof formData])
      if (error) newErrors[key] = error
    })

    const mapToApi = () => {
      return {
        first_name: formData.firstName,
        last_name: formData.lastName,
        national_code: formData.nationalId,
        email: formData.email,
        shaba_number: formData.sheba,
        city: formData.city,
        province: formData.province,
        postal_code: formData.postalCode,
        full_address: formData.address,
        image: selectedImage || undefined,
      }
    }

    if (Object.keys(newErrors).length === 0) {
      const payload = mapToApi()
      setUploadProgress(0)
      updateUser({
        data: payload,
        progress: (p) => setUploadProgress(p),
      })
        .then(() => {
          setUploadProgress(null)
          setSelectedImage(null)
        })
        .catch(() => {
          setUploadProgress(null)
        })
    } else {
      setErrors(newErrors)
    }
  }

  const renderField = (
    label: string,
    name: keyof typeof formData,
    placeholder?: string,
    verified?: boolean,
    helperText?: string,
    icon?: React.ReactNode,
    fullWidth: boolean = false,
    hasBorder: boolean = false,
    isLtr: boolean = false,
  ) => (
    <Box
      className={`${styles.fieldWrapper} ${fullWidth ? styles.fullWidth : ""} ${hasBorder ? styles.hasBorder : ""}`}
    >
      <Box className={styles.labelWrapper}>
        <Typography className={styles.label}>{label}</Typography>
        {verified && (
          <Box className={styles.verifiedBadge}>
            <CustomCheckIcon sx={{ fontSize: 16 }} />
            تایید شده
          </Box>
        )}
      </Box>
      <TextField
        fullWidth
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        variant="outlined"
        className={`${styles.inputField} ${isLtr ? styles.ltrInput : ""}`}
        error={!!errors[name]}
        InputProps={{
          startAdornment: icon ? (
            <InputAdornment position="start">{icon}</InputAdornment>
          ) : null,
        }}
      />
      {errors[name] ? (
        <Typography className={styles.errorText}>{errors[name]}</Typography>
      ) : helperText ? (
        <Typography className={styles.helperText}>{helperText}</Typography>
      ) : null}
    </Box>
  )

  return (
    <Box
      component="form"
      className={styles.formContainer}
      onSubmit={handleSubmit}
    >
      <Box className={styles.sectionHeader}>
        <Typography className={styles.sectionTitle}>اطلاعات شخصی</Typography>
        <Typography className={styles.sectionSubtitle}>
          اطلاعات تماس، حساب بانکی و آدرس خود را به‌روزرسانی کنید
        </Typography>
      </Box>

      <Box className={styles.avatarSection}>
        <Box className={styles.uploadInfo}>
          <input
            type="file"
            accept="image/*"
            id="avatar-upload"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <label htmlFor="avatar-upload">
            <Button
              variant="outlined"
              component="span"
              className={styles.uploadButton}
              startIcon={<FileUploadOutlinedIcon />}
            >
              آپلود عکس
            </Button>
          </label>
          <Typography className={styles.uploadText}>
            حداکثر حجم ۲ مگابایت
            <br />
            jpg - png
          </Typography>
          {uploadProgress !== null && (
            <Box className={styles.progressContainer}>
              <Box
                className={styles.progressBar}
                style={{ width: `${uploadProgress}%` }}
              />
            </Box>
          )}
        </Box>
        <Box className={styles.avatarWrapper}>
          <Avatar
            className={styles.avatar}
            src={imagePreview || user?.image || undefined}
          >
            {!imagePreview && !user?.image && (
              <PersonOutlineIcon fontSize="inherit" />
            )}
          </Avatar>
        </Box>
      </Box>

      <Box className={styles.gridContainer}>
        {renderField("نام خانوادگی", "lastName")}
        {renderField("نام", "firstName")}
        {renderField(
          "کد ملی",
          "nationalId",
          "۱۲۳۴۵۶۷۸۹۰",
          user?.national_code_verified,
          "",
          null,
          true,
          true,
          true,
        )}

        {renderField(
          "شماره موبایل",
          "mobile",
          "۰۹۱۲۳۴۵۶۷۸۹",
          true,
          "سیم کارت باید به نام خودتان باشد",
          <LocalPhoneOutlinedIcon />,
          true,
          false,
          true,
        )}

        {renderField(
          "آدرس ایمیل",
          "email",
          "mohammad.ahmadi@example.com",
          user?.email_verified,
          "",
          <MailOutlineIcon />,
          true,
          true,
          true,
        )}

        {renderField(
          "شماره شبا",
          "sheba",
          "IR۱۲۳۴۵۶۷۸۹۰۱۲۳۴۵۶۷۸۹۰۱۲۳۴",
          user?.shaba_number_verified,
          "حساب بانکی باید به نام خودتان باشد",
          null,
          true,
          true,
        )}

        <Box
          className={`${styles.gridContainer} ${styles.fullWidth}`}
          style={{ marginBottom: 0 }}
        >
          <Dropdown
            title="استان"
            placeholder={
              isLoadingProvinces ? "در حال بارگذاری..." : "انتخاب استان"
            }
            options={provinces.map((p) => ({
              label: p.name,
              slug: p.id.toString(),
            }))}
            initialSlug={formData.province}
            onChange={(slug) => {
              setFormData((prev) => ({ ...prev, province: slug, city: "" }))
              fetchCities(Number(slug))
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
            options={cities.map((c) => ({
              label: c.name,
              slug: c.id.toString(),
            }))}
            initialSlug={formData.city}
            onChange={(slug) =>
              setFormData((prev) => ({ ...prev, city: slug }))
            }
            disabled={!formData.province}
          />
        </Box>

        {renderField(
          "کد پستی",
          "postalCode",
          "۱۲۳۴۵۶۷۸۹۰",
          false,
          "",
          null,
          true,
          false,
          true,
        )}

        {renderField(
          "آدرس کامل",
          "address",
          "خیابان ولیعصر، نرسیده به میدان ونک، پلاک ۱۲۳",
          false,
          "",
          <LocationOnOutlinedIcon />,
          true,
        )}
      </Box>

      <Box className={styles.submitSection}>
        <Button
          type="submit"
          variant="contained"
          className={styles.submitButton}
        >
          ذخیره تغییرات
        </Button>
      </Box>
    </Box>
  )
}

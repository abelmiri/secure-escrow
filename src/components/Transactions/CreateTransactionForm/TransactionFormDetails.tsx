import React, { useState } from "react"
import RadioButton from "@/components/RadioButton/RadioButton"
import Dropdown from "@/components/DropDownInput/DropDownInput"
import ListInput from "@/components/ListInput/ListInput"
import styles from "./styles/TransactionFormDetails.module.scss"
import { Button, CircularProgress } from "@mui/material"
import { useCategories } from "@/hooks/deals/useCategories"
import { useSubCategories } from "@/hooks/deals/useSubCategories"

const roles = [
  { title: "خریدار", value: "buyer" },
  { title: "فروشنده", value: "seller" },
  { title: "کارگزار (واسط)", value: "broker" },
]

export default function TransactionFormDetails() {
  const [role, setRole] = useState("buyer")
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  )
  const [selectedSubCategorySlug, setSelectedSubCategorySlug] = useState("")

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const { categories, isLoading: isCategoriesLoading } = useCategories()
  const { subCategories, isLoading: isSubCategoriesLoading } =
    useSubCategories(selectedCategoryId)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTextBlack}>جزئیات تراکنش</div>
        <div className={styles.headerTextGray}>
          اطلاعات دقیق محصول یا دارایی مورد معامله را وارد کنید
        </div>
      </div>

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
        onChange={(id: string) => {
          setSelectedCategoryId(Number(id))
          setSelectedSubCategorySlug("") // Reset sub-category on parent change
        }}
      />

      <Dropdown
        title="نوع دسته بندی"
        placeholder={
          isSubCategoriesLoading
            ? "در حال بارگذاری..."
            : !selectedCategoryId
              ? "ابتدا دسته بندی اصلی را انتخاب کنید"
              : "زیر دسته بندی انتخاب کنید"
        }
        options={subCategories.map((item) => ({
          label: item.name,
          slug: item.slug,
        }))}
        onChange={(slug: string) => setSelectedSubCategorySlug(slug)}
        disabled={!selectedCategoryId || isSubCategoriesLoading}
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
        placeholder="جهت درج هر نوع توضیح تکمیلی..."
        title="توضیحات اضافی"
        value={description}
        onChange={setDescription}
      />

      <div className={styles.buttonGroup}>
        <Button className={styles.buttonPrimary} variant="contained">
          ادامه
        </Button>
      </div>
    </div>
  )
}

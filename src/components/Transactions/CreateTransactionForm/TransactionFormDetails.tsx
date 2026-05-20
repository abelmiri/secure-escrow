import React, { useState } from "react"
import RadioButton from "@/components/RadioButton/RadioButton"
import Dropdown from "@/components/DropDownInput/DropDownInput"
import ListInput from "@/components/ListInput/ListInput"
import styles from "./styles/TransactionFormDetails.module.scss"
import { Button } from "@mui/material"

const roles = [
  { title: "خریدار", value: "buyer" },
  { title: "فروشنده", value: "seller" },
  { title: "کارگزار (واسط)", value: "broker" },
]

const transactionTypes = [
  { name: "وسایل نقلیه", slug: "vehicles" },
  { name: "کالا", slug: "goods" },
  { name: "املاک", slug: "property" },
]

export default function TransactionFormDetails() {
  const [role, setRole] = useState("buyer")
  const [transactionType, setTransactionType] = useState("")

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

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
            checked={role === data.value}
            onChange={() => setRole(data.value)}
          />
        ))}
      </div>

      <Dropdown
        title="دسته بندی معامله"
        placeholder="یک دسته بندی انتخاب کنید"
        options={transactionTypes.map((item) => ({
          label: item.name,
          slug: item.slug,
        }))}
        onChange={(slug: string) => setTransactionType(slug)}
      />

      <Dropdown
        title="نوع دسته بندی"
        placeholder="زیر دسته بندی انتخاب کنید"
        options={transactionTypes.map((item) => ({
          label: item.name,
          slug: item.slug,
        }))}
        onChange={(slug: string) => setTransactionType(slug)}
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

import React, { useState } from "react"
import RadioButton from "@/components/RadioButton/RadioButton"
import Dropdown from "@/components/DropDownInput/DropDownInput"
import ListInput from "@/components/ListInput/ListInput"
import styles from "./styles/TransactionFormDetails.module.scss"
import { Button, CircularProgress } from "@mui/material"
import { useCategories } from "@/hooks/deals/useCategories"
import { useSubCategories } from "@/hooks/deals/useSubCategories"

const roles = [
  { title: "خریدار", value: "customer" },
  { title: "فروشنده", value: "beneficiary" },
  { title: "کارگزار (واسط)", value: "broker" },
]

export default function TransactionFormDetails() {
  const [role, setRole] = useState("customer")
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  )
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    number | null
  >(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [propertyValues, setPropertyValues] = useState<Record<string, any>>({})
  const [escrowAmount, setEscrowAmount] = useState("")
  const [isTotalCost, setIsTotalCost] = useState("yes")
  const [totalTransactionAmount, setTotalTransactionAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [paymentDescription, setPaymentDescription] = useState("")

  const { categories, isLoading: isCategoriesLoading } = useCategories()
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId)
  const subCategoriesList = selectedCategory?.sub_categories || []

  const {
    properties,
    subCategoryName,
    subCategoryDescription,
    isLoading: isPropertiesLoading,
  } = useSubCategories(selectedSubCategoryId)

  const handlePropertyChange = (propertyName: string, value: any) => {
    setPropertyValues((prev) => ({ ...prev, [propertyName]: value }))
  }

  const isHalfWidth = (propertyName: string) => {
    return propertyName === "quantity" || propertyName === "weight"
  }

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
        placeholder="جهت درج هر نوع توضیح تکمیلی..."
        title="توضیحات اضافی"
        value={description}
        onChange={setDescription}
      />

      {isPropertiesLoading && (
        <div
          style={{ display: "flex", justifyContent: "center", padding: "20px" }}
        >
          <CircularProgress size={24} />
        </div>
      )}

      {!isPropertiesLoading && properties.length > 0 && (
        <div className={styles.propertiesBox}>
          <div className={styles.propertiesHeader}>
            <div className={styles.propertiesTitle}>{subCategoryName}</div>
            {subCategoryDescription && (
              <div className={styles.propertiesDescription}>
                {subCategoryDescription}
              </div>
            )}
          </div>

          <div className={styles.propertiesGrid}>
            {properties.map((prop) => (
              <div
                key={prop.property_name}
                className={
                  isHalfWidth(prop.property_name) ? "" : styles.fullWidth
                }
              >
                {prop.field_type === "select" ||
                prop.field_type === "dropdown" ? (
                  <Dropdown
                    title={prop.name}
                    placeholder={`انتخاب ${prop.name}`}
                    options={prop.options?.map((opt) => {
                      if (typeof opt === "string") {
                        return { label: opt, slug: opt }
                      }
                      return { label: opt.label, slug: opt.value }
                    })}
                    onChange={(val) =>
                      handlePropertyChange(prop.property_name, val)
                    }
                  />
                ) : (
                  <ListInput
                    title={prop.name}
                    placeholder={prop.name}
                    value={propertyValues[prop.property_name] || ""}
                    onChange={(val) =>
                      handlePropertyChange(prop.property_name, val)
                    }
                    valueType={
                      prop.field_type === "integer" ? "number" : "string"
                    }
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!isPropertiesLoading && selectedSubCategoryId && (
        <>
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

          <div className={styles.buttonGroup}>
            <Button className={styles.buttonPrimary} variant="contained">
              ادامه
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

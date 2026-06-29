import Dropdown from "@/components/DropDownInput/DropDownInput"
import ListInput from "@/components/ListInput/ListInput"
import RadioButton from "@/components/RadioButton/RadioButton"
import type { Category, SubCategory } from "@/hooks/deals/useCategories"
import styles from "./styles/TransactionFormDetails.module.scss"

interface TransactionBasicDetailsProps {
  role: string
  categories: Category[]
  subCategories: SubCategory[]
  selectedCategoryId: number | null
  selectedSubCategoryId: number | null
  isCategoriesLoading: boolean
  title: string
  description: string
  fieldErrors?: string[]
  onRoleChange: (role: string) => void
  onCategoryChange: (categoryId: number) => void
  onSubCategoryChange: (subCategoryId: number) => void
  onTitleChange: (title: string) => void
  onDescriptionChange: (description: string) => void
}

const roles = [
  { title: "خریدار", value: "customer" },
  { title: "فروشنده", value: "beneficiary" },
  { title: "کارگزار (واسط)", value: "broker" },
]

export default function TransactionBasicDetails({
  role,
  categories,
  subCategories,
  selectedCategoryId,
  selectedSubCategoryId,
  isCategoriesLoading,
  title,
  description,
  fieldErrors = [],
  onRoleChange,
  onCategoryChange,
  onSubCategoryChange,
  onTitleChange,
  onDescriptionChange,
}: TransactionBasicDetailsProps) {
  return (
    <>
      <div className={styles.roleSelect}>
        <div className={styles.roleSelectText}>نقش شما در این معامله</div>
        {roles.map((item) => (
          <RadioButton
            key={item.value}
            title={item.title}
            name="user-role"
            value={item.value}
            checked={role === item.value}
            onChange={() => onRoleChange(item.value)}
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
          slug: item.id.toString(),
        }))}
        initialSlug={selectedCategoryId?.toString()}
        onChange={(id) => onCategoryChange(Number(id))}
        required
        error={fieldErrors.includes("category")}
      />

      <Dropdown
        title="نوع دسته بندی"
        placeholder={
          !selectedCategoryId
            ? "ابتدا دسته بندی اصلی را انتخاب کنید"
            : "زیر دسته بندی انتخاب کنید"
        }
        options={subCategories.map((item) => ({
          label: item.name,
          slug: item.id.toString(),
        }))}
        initialSlug={selectedSubCategoryId?.toString()}
        onChange={(id) => onSubCategoryChange(Number(id))}
        disabled={!selectedCategoryId}
        required
        error={fieldErrors.includes("subcategory")}
      />

      <ListInput
        valueType="string"
        placeholder="عنوان کوتاه و مشخص"
        title="عنوان معامله"
        value={title}
        onChange={onTitleChange}
        regex={/^[\u0600-\u06FFa-zA-Z0-9\s]+$/}
        rejectPersianDigits
        required
        error={fieldErrors.includes("title")}
      />

      <ListInput
        textarea
        placeholder="جهت درج هر نوع توضیحات تکمیلی..."
        title="توضیحات اضافی"
        value={description}
        onChange={onDescriptionChange}
      />
    </>
  )
}

import {
  Checkbox,
  FormControl,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material"
import type { SelectChangeEvent } from "@mui/material/Select"
import DatePicker from "@/components/DatePicker/DatePicker"
import Dropdown from "@/components/DropDownInput/DropDownInput"
import ListInput from "@/components/ListInput/ListInput"
import RadioButton from "@/components/RadioButton/RadioButton"
import type { Property } from "@/hooks/deals/useSubCategories"
import {
  getTransactionPropertyWidth,
  type PropertyFieldWidth,
} from "@/lib/transactionPropertyLayout"
import IranLocationPicker, {
  isMapLocationValue,
  type MapLocationValue,
} from "./IranLocationPicker"
import styles from "./styles/TransactionFormDetails.module.scss"

export type PropertyInputValue =
  | string[]
  | string
  | number
  | boolean
  | MapLocationValue
  | Date
  | null
  | undefined

interface DynamicPropertyFieldProps {
  property: Property
  subCategorySlug?: string
  value: PropertyInputValue
  error?: boolean
  onChange: (value: PropertyInputValue) => void
}

const widthClassNames: Record<PropertyFieldWidth, string> = {
  full: styles.fieldFull,
  half: styles.fieldHalf,
  third: styles.fieldThird,
  twoThird: styles.fieldTwoThird,
}

export default function DynamicPropertyField({
  property,
  subCategorySlug,
  value,
  error = false,
  onChange,
}: DynamicPropertyFieldProps) {
  const options =
    property.options?.map((option) =>
      typeof option === "string"
        ? { label: option, value: option }
        : { label: option.label, value: option.value },
    ) || []
  const stringValue = typeof value === "string" ? value : ""
  const stringArrayValue =
    Array.isArray(value) && value.every((item) => typeof item === "string")
      ? value
      : []
  const mapValue = isMapLocationValue(value) ? value : null
  const propertyName = property.property_name || property.slug
  const fieldWidth = getTransactionPropertyWidth(subCategorySlug, propertyName)

  return (
    <div className={widthClassNames[fieldWidth]}>
      {property.field_type === "select" ||
      property.field_type === "dropdown" ? (
        <Dropdown
          title={property.name}
          placeholder={`انتخاب ${property.name}`}
          options={options.map((option) => ({
            label: option.label,
            slug: option.value,
          }))}
          onChange={onChange}
          required={property.is_required}
          initialSlug={stringValue}
          error={error}
        />
      ) : property.field_type === "multiselect" ? (
        <div className={styles.multiSelectContainer}>
          <div className={styles.multiSelectTitle}>
            {property.name}
            {property.is_required && (
              <span className={styles.requiredMark}>*</span>
            )}
          </div>
          <FormControl
            fullWidth
            className={`${styles.multiSelectField} ${
              error ? styles.multiSelectFieldError : ""
            }`}
          >
            <Select<string[]>
              multiple
              displayEmpty
              value={stringArrayValue}
              onChange={(event: SelectChangeEvent<string[]>) => {
                const selected = event.target.value as string[] | string
                onChange(
                  typeof selected === "string" ? selected.split(",") : selected,
                )
              }}
              renderValue={(selected) => {
                const labels = options
                  .filter((option) => selected.includes(option.value))
                  .map((option) => option.label)

                return labels.length ? (
                  labels.join("، ")
                ) : (
                  <span className={styles.multiSelectPlaceholder}>
                    انتخاب {property.name}
                  </span>
                )
              }}
              MenuProps={{
                PaperProps: {
                  className: styles.multiSelectMenu,
                },
              }}
            >
              {options.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  className={styles.multiSelectOption}
                >
                  <Checkbox
                    size="small"
                    checked={stringArrayValue.includes(option.value)}
                  />
                  <ListItemText primary={option.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      ) : property.field_type === "date" ? (
        <DatePicker
          title={property.name}
          placeholder={`انتخاب ${property.name}`}
          value={stringValue}
          onChange={onChange}
          required={property.is_required}
          error={error}
        />
      ) : property.field_type === "map" ? (
        <IranLocationPicker
          title={property.name}
          value={mapValue}
          required={property.is_required}
          error={error}
          onChange={onChange}
        />
      ) : property.field_type === "bool" ? (
        <div className={error ? styles.radioGroupError : undefined}>
          <div className={styles.radioQuestion}>{property.name}</div>
          <div className={styles.radioOptions}>
            <RadioButton
              title="دارد"
              name={property.slug}
              value="true"
              checked={value === true}
              onChange={() => onChange(true)}
            />
            <RadioButton
              title="ندارد"
              name={property.slug}
              value="false"
              checked={value === false}
              onChange={() => onChange(false)}
            />
          </div>
        </div>
      ) : (
        <ListInput
          title={property.name}
          placeholder={
            property.unit
              ? `${property.name} (${property.unit})`
              : property.name
          }
          value={stringValue}
          onChange={onChange}
          valueType={property.field_type === "integer" ? "number" : "string"}
          rejectPersianDigits
          required={property.is_required}
          error={error}
          regex={
            property.regex_pattern
              ? new RegExp(property.regex_pattern)
              : undefined
          }
        />
      )}
    </div>
  )
}

import Dropdown from "@/components/DropDownInput/DropDownInput"
import ListInput from "@/components/ListInput/ListInput"
import RadioButton from "@/components/RadioButton/RadioButton"
import styles from "./styles/TransactionFormDetails.module.scss"

interface TransactionFinancialDetailsProps {
  escrowAmount: string
  isTotalCost: string
  totalTransactionAmount: string
  paymentMethod: string
  paymentDescription: string
  onEscrowAmountChange: (value: string) => void
  onIsTotalCostChange: (value: string) => void
  onTotalTransactionAmountChange: (value: string) => void
  onPaymentMethodChange: (value: string) => void
  onPaymentDescriptionChange: (value: string) => void
}

const paymentMethodOptions = [
  { label: "پرداخت نقدی/کارت‌به‌کارت", slug: "Cash" },
  { label: "واریز به حساب امانی در مرحله بعدی", slug: "Escrow" },
  { label: "ارائه چک صیادی", slug: "Cheque" },
  { label: "تهاتر یا معاوضه", slug: "Change" },
]

export default function TransactionFinancialDetails({
  escrowAmount,
  isTotalCost,
  totalTransactionAmount,
  paymentMethod,
  paymentDescription,
  onEscrowAmountChange,
  onIsTotalCostChange,
  onTotalTransactionAmountChange,
  onPaymentMethodChange,
  onPaymentDescriptionChange,
}: TransactionFinancialDetailsProps) {
  return (
    <section className={styles.financialSection}>
      <div className={styles.sectionTitle}>جزئیات مالی معامله</div>

      <div className={styles.fieldWrapper}>
        <ListInput
          title="مبلغ واریزی به حساب امانی (ریال)"
          placeholder="مبلغ واریزی به حساب امانی"
          value={escrowAmount}
          onChange={onEscrowAmountChange}
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
            onChange={() => onIsTotalCostChange("yes")}
          />
          <RadioButton
            title="خیر، فقط بخشی از هزینه معامله"
            name="is-total-cost"
            value="no"
            checked={isTotalCost === "no"}
            onChange={() => onIsTotalCostChange("no")}
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
              onChange={onTotalTransactionAmountChange}
              valueType="number"
            />
            <div className={styles.fieldDescription}>
              مجموع کل هزینه معامله شامل پرداخت اولیه در پلتفرم + پرداخت‌های
              خارج از حساب امانی
            </div>
          </div>

          <Dropdown
            title="شیوه پرداخت باقی‌مانده هزینه"
            placeholder="انتخاب کنید"
            options={paymentMethodOptions}
            onChange={onPaymentMethodChange}
            initialSlug={paymentMethod}
          />

          <ListInput
            textarea
            title="توضیحات شیوه پرداخت"
            placeholder="مثال: باقی مبلغ هنگام تنظیم سند رسمی در دفترخانه دریافت می‌شود"
            value={paymentDescription}
            onChange={onPaymentDescriptionChange}
          />
        </div>
      )}
    </section>
  )
}

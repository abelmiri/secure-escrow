import { Box, Typography } from "@mui/material"
import type { DealParty, DealPartyUser } from "@/hooks/deals/useDeal"
import { getPartyMobileNumber } from "@/hooks/deals/useDeal"
import styles from "./styles/TransactionParties.module.scss"

const roleLabels: Record<string, string> = {
  customer: "خریدار",
  beneficiary: "فروشنده",
  broker: "کارگزار",
}

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}
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

const getUser = (party: DealParty): DealPartyUser | undefined =>
  typeof party.user === "object" ? party.user : undefined

const getPartyName = (party: DealParty) => {
  const user = getUser(party)
  const firstName = user?.first_name || party.first_name || ""
  const lastName = user?.last_name || party.last_name || ""
  const fullName =
    user?.full_name || party.full_name || `${firstName} ${lastName}`.trim()

  return fullName || getPartyMobileNumber(party) || "نامشخص"
}

const getPartyRoleLabel = (party: DealParty) =>
  party.role ? roleLabels[party.role] || party.role : "نامشخص"

const isPartyVerified = (party: DealParty) => {
  const user = getUser(party)
  return party.is_verified ?? user?.is_verified ?? true
}

const sortParties = (parties: DealParty[]) => {
  const roleOrder: Record<string, number> = {
    customer: 0,
    beneficiary: 1,
    broker: 2,
  }

  return [...parties].sort(
    (first, second) =>
      (roleOrder[first.role || ""] ?? 99) -
      (roleOrder[second.role || ""] ?? 99),
  )
}

interface TransactionPartiesProps {
  parties?: DealParty[]
}

export default function TransactionParties({
  parties = [],
}: TransactionPartiesProps) {
  const visibleParties = sortParties(parties)

  if (!visibleParties.length) return null

  return (
    <Box className={styles.card}>
      <Typography variant="h3" className={styles.title}>
        طرفین معامله
      </Typography>

      <Box className={styles.content}>
        {visibleParties.map((party, index) => (
          <Box
            key={`${party.role || "party"}-${getPartyMobileNumber(party) || index}`}
            className={styles.partyItem}
          >
            <Box className={styles.partyHeader}>
              <Typography className={styles.partyLabel}>
                {getPartyRoleLabel(party)}
              </Typography>
              {isPartyVerified(party) && (
                <Box className={styles.verifiedBadge}>
                  <Typography className={styles.verifiedText}>
                    تایید شده
                  </Typography>
                  <CheckIcon className={styles.verifiedIcon} />
                </Box>
              )}
            </Box>
            <Typography className={styles.partyName}>
              {getPartyName(party)}
            </Typography>
            <Typography className={styles.partyMobile}>
              {getPartyMobileNumber(party) || "شماره ثبت نشده"}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

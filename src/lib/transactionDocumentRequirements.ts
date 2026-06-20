import type { DocumentRequirement } from "@/hooks/documents/useDocumentRequirements"

const roleAliases: Record<string, string[]> = {
  beneficiary: ["beneficiary", "seller"],
  seller: ["seller", "beneficiary"],
  customer: ["customer", "buyer"],
  buyer: ["buyer", "customer"],
  broker: ["broker"],
}

export function isDocumentRequirementAllowedForRole(
  requirement: DocumentRequirement,
  role: string,
) {
  const allowedRoles = requirement.allowed_upload_roles

  if (!allowedRoles?.length) return true

  const normalizedRole = role.trim().toLowerCase()
  const acceptedRoles = new Set(roleAliases[normalizedRole] || [normalizedRole])

  return allowedRoles.some((allowedRole) =>
    acceptedRoles.has(allowedRole.trim().toLowerCase()),
  )
}

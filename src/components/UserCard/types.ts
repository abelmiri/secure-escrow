export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "admin" | "user" | "guest"
  isActive: boolean
  joinDate: Date
  bio?: string
  location?: string
  phone?: string
  department?: string
  lastLogin?: Date
}

export interface UserCardProps {
  user: User
  onEdit?: (userId: string) => void
  onDelete?: (userId: string) => void
  showActions?: boolean
  className?: string
}

export type UserRole = User["role"]

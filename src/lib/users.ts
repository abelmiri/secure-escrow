import type { User } from "@/components/UserCard/types"

export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    isActive: true,
    joinDate: new Date("2023-01-15"),
    bio: "Experienced administrator with a passion for technology and innovation. Leading teams to success through effective management and strategic planning.",
    location: "San Francisco, CA",
    phone: "+1 (555) 123-4567",
    department: "Engineering",
    lastLogin: new Date("2024-01-20T14:30:00"),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "user",
    isActive: true,
    joinDate: new Date("2023-06-20"),
    avatar: undefined,
    bio: "Creative designer focused on user experience and visual storytelling. Bringing ideas to life through thoughtful design and attention to detail.",
    location: "New York, NY",
    phone: "+1 (555) 234-5678",
    department: "Design",
    lastLogin: new Date("2024-01-19T09:15:00"),
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "guest",
    isActive: false,
    joinDate: new Date("2024-01-10"),
    bio: "Marketing professional exploring new opportunities. Passionate about digital marketing and brand development.",
    location: "Chicago, IL",
    phone: "+1 (555) 345-6789",
    department: "Marketing",
    lastLogin: new Date("2024-01-15T16:45:00"),
  },
]

export function getUserById(id: string): User | undefined {
  return mockUsers.find((user) => user.id === id)
}

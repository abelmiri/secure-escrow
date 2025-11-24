"use client";

import { Container, Paper, Typography, Box } from "@mui/material";
import HomePageButtons from "@/components/HomePageButtons";
import UserCard from "@/components/UserCard";
import type { User } from "@/components/UserCard/types";

const sampleUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    isActive: true,
    joinDate: new Date("2023-01-15"),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "user",
    isActive: true,
    joinDate: new Date("2023-06-20"),
    avatar: undefined,
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "guest",
    isActive: false,
    joinDate: new Date("2024-01-10"),
  },
];

export default function HomePage() {
  const handleEdit = (userId: string): void => {
    console.log("Edit user:", userId);
  };

  const handleDelete = (userId: string): void => {
    console.log("Delete user:", userId);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          My Material Design System
        </Typography>

        <Typography variant="body1" gutterBottom>
          Next.js + TypeScript + Material UI are set up. 🎉
        </Typography>

        <HomePageButtons />
      </Paper>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
          Complex Component Example: User Cards
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {sampleUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={handleEdit}
              onDelete={handleDelete}
              showActions={true}
            />
          ))}
        </Box>
      </Box>
    </Container>
  );
}

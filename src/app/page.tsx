"use client";

import { Container, Paper, Typography, Box } from "@mui/material";
import HomePageButtons from "@/components/HomePageButtons";
import UserCard from "@/components/UserCard";
import LandingInfo from "@/components/LandingInfo";
import { mockUsers } from "@/lib/users";

export default function HomePage() {
  const handleEdit = (userId: string): void => {
    console.log("Edit user:", userId);
  };

  const handleDelete = (userId: string): void => {
    console.log("Delete user:", userId);
  };

  return (
    <>
      <LandingInfo />
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
          {mockUsers.map((user) => (
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
    </>
  );
}

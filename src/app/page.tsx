"use client";

import { Container, Paper, Typography } from "@mui/material";
import HomePageButtons from "@/components/HomePageButtons";

export default function HomePage() {
  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          My Material Design System
        </Typography>

        <Typography variant="body1" gutterBottom>
          Next.js + TypeScript + Material UI are set up. 🎉
        </Typography>

        <HomePageButtons />
      </Paper>
    </Container>
  );
}

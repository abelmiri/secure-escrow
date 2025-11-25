import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container, Typography, CircularProgress, Box } from "@mui/material";
import UserDetail from "@/components/UserDetail";
import { getUserById } from "@/lib/users";
import type { User } from "@/components/UserCard/types";

export default function UserPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const userId = params?.id as string;

    if (!userId) {
      router.push("/");
      return;
    }

    const foundUser = getUserById(userId);

    if (!foundUser) {
      router.push("/");
      return;
    }

    setUser(foundUser);
    setLoading(false);
  }, [params, router]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <CircularProgress />
          <Typography variant="body1" color="text.secondary">
            Loading user information...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Typography variant="h4" color="error">
          User not found
        </Typography>
      </Container>
    );
  }

  return <UserDetail user={user} />;
}


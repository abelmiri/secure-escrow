"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import type { UserCardProps } from "./types";
import styles from "./styles/UserCard.module.scss";

export default function UserCard({
  user,
  onEdit,
  onDelete,
  showActions = true,
  className,
}: UserCardProps) {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleEdit = (): void => {
    if (onEdit) {
      onEdit(user.id);
    }
  };

  const handleDelete = (): void => {
    if (onDelete) {
      onDelete(user.id);
    }
  };

  const getRoleColor = (role: UserCardProps["user"]["role"]): "default" | "primary" | "secondary" => {
    switch (role) {
      case "admin":
        return "primary";
      case "user":
        return "default";
      case "guest":
        return "secondary";
      default:
        return "default";
    }
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card
      className={`${styles.card} ${className || ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      elevation={isHovered ? 4 : 2}
    >
      <CardContent className={styles.cardContent}>
        <Box className={styles.header}>
          <Avatar
            src={user.avatar}
            alt={user.name}
            className={styles.avatar}
            sx={{ bgcolor: "var(--color-first)" }}
          >
            {!user.avatar && getInitials(user.name)}
          </Avatar>
          <Box className={styles.userInfo}>
            <Typography variant="h6" component="h3" className={styles.userName}>
              {user.name}
            </Typography>
            <Chip
              label={user.role}
              color={getRoleColor(user.role)}
              size="small"
              className={styles.roleChip}
            />
          </Box>
        </Box>

        <Box className={styles.details}>
          <Box className={styles.detailItem}>
            <EmailIcon className={styles.icon} />
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>

          <Box className={styles.detailItem}>
            <PersonIcon className={styles.icon} />
            <Typography variant="body2" color="text.secondary">
              Joined: {formatDate(user.joinDate)}
            </Typography>
          </Box>

          <Chip
            label={user.isActive ? "Active" : "Inactive"}
            color={user.isActive ? "success" : "default"}
            size="small"
            className={styles.statusChip}
          />
        </Box>
      </CardContent>

      {showActions && (onEdit || onDelete) && (
        <CardActions className={styles.cardActions}>
          {onEdit && (
            <Tooltip title="Edit User">
              <IconButton
                onClick={handleEdit}
                className={styles.editButton}
                aria-label="Edit user"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Delete User">
              <IconButton
                onClick={handleDelete}
                className={styles.deleteButton}
                aria-label="Delete user"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
          <Button
            variant="contained"
            className={styles.viewButton}
            size="small"
          >
            View Profile
          </Button>
        </CardActions>
      )}
    </Card>
  );
}


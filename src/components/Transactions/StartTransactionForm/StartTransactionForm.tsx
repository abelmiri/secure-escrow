"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import styles from "./styles/StartTransactionForm.module.scss";

export default function StartTransactionForm() {
  const [formData, setFormData] = useState({
    transactionTitle: "",
    myRole: "فروشنده",
    currency: "USD",
    inspectionPeriod: "1",
    transactionDisclosure: "فقط برای فروشنده شفاف",
    // Common fields for Seller/Buyer
    itemCategory: "",
    itemName: "",
    price: "800",
    itemDescription: "",
    // Broker fields
    brokerCommission: "0",
  });

  const formatNumber = (value: string): string => {
    // Remove all non-digit characters except decimal point
    const cleaned = value.replace(/[^\d.]/g, "");
    // Split by decimal point
    const parts = cleaned.split(".");
    // Format integer part with commas
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // Return formatted number
    return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;
  };

  const parseNumber = (value: string): string => {
    // Remove commas for storage
    return value.replace(/,/g, "");
  };

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleNumberChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const cleaned = parseNumber(e.target.value);
    setFormData((prev) => ({
      ...prev,
      [field]: cleaned,
    }));
  };

  const handleSelectChange = (field: string) => (
    e: { target: { value: unknown } }
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value as string,
    }));
  };

  const handleAddItem = () => {
    console.log("Add item:", formData);
    // Handle form submission here
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.formCard}>
        {/* Start Transaction Section */}
        <Box className={styles.section}>
          <Typography variant="h2" className={styles.sectionTitle}>
            شروع تراکنش
          </Typography>

          <TextField
            label="عنوان تراکنش"
            value={formData.transactionTitle}
            onChange={handleChange("transactionTitle")}
            fullWidth
            className={styles.transactionTitle}
            variant="outlined"
          />

          <Box className={styles.row}>
            <FormControl fullWidth className={styles.field}>
              <InputLabel>نقش من</InputLabel>
              <Select
                value={formData.myRole}
                onChange={handleSelectChange("myRole")}
                label="نقش من"
              >
                <MenuItem value="فروشنده">فروشنده</MenuItem>
                <MenuItem value="خریدار">خریدار</MenuItem>
                <MenuItem value="کارگزار">کارگزار</MenuItem>
              </Select>
            </FormControl>

            {formData.myRole === "کارگزار" ? (
              <FormControl fullWidth className={styles.field}>
                <InputLabel>شفافیت تراکنش</InputLabel>
                <Select
                  value={formData.transactionDisclosure}
                  onChange={handleSelectChange("transactionDisclosure")}
                  label="شفافیت تراکنش"
                >
                  <MenuItem value="فقط برای فروشنده شفاف">
                    فقط برای فروشنده شفاف
                  </MenuItem>
                  <MenuItem value="فقط برای خریدار شفاف">
                    فقط برای خریدار شفاف
                  </MenuItem>
                  <MenuItem value="برای هر دو شفاف">برای هر دو شفاف</MenuItem>
                </Select>
              </FormControl>
            ) : (
              <FormControl fullWidth className={styles.field}>
                <InputLabel>ارز</InputLabel>
                <Select
                  value={formData.currency}
                  onChange={handleSelectChange("currency")}
                  label="ارز"
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="GBP">GBP</MenuItem>
                </Select>
              </FormControl>
            )}

            <TextField
              label="دوره بازرسی (روز)"
              value={formatNumber(formData.inspectionPeriod)}
              onChange={handleNumberChange("inspectionPeriod")}
              className={styles.field}
              variant="outlined"
            />
          </Box>

          {formData.myRole === "کارگزار" && (
            <FormControl fullWidth className={styles.field}>
              <InputLabel>ارز</InputLabel>
              <Select
                value={formData.currency}
                onChange={handleSelectChange("currency")}
                label="ارز"
              >
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
                <MenuItem value="GBP">GBP</MenuItem>
              </Select>
            </FormControl>
          )}
        </Box>

        {/* Transaction Details Section */}
        <Box className={styles.section}>
          <Typography variant="h2" className={styles.sectionTitle}>
            جزئیات تراکنش
          </Typography>

          {/* Seller Form */}
          {formData.myRole === "فروشنده" && (
            <>
              <TextField
                label="دسته‌بندی کالا"
                value={formData.itemCategory}
                onChange={handleChange("itemCategory")}
                fullWidth
                className={styles.field}
                variant="outlined"
              />

              <Box className={styles.row}>
                <TextField
                  label="نام کالا"
                  value={formData.itemName}
                  onChange={handleChange("itemName")}
                  fullWidth
                  className={styles.field}
                  variant="outlined"
                />

                <TextField
                  label="قیمت (تومان)"
                  value={formatNumber(formData.price)}
                  onChange={handleNumberChange("price")}
                  className={styles.field}
                  variant="outlined"
                  InputProps={{
                    endAdornment: <span style={{ marginLeft: 8 }}>تومان</span>,
                  }}
                />
              </Box>

              <TextField
                label="توضیحات کالا"
                value={formData.itemDescription}
                onChange={handleChange("itemDescription")}
                fullWidth
                multiline
                rows={4}
                className={styles.field}
                variant="outlined"
              />

              <Box className={styles.buttonContainer}>
                <Button
                  variant="contained"
                  onClick={handleAddItem}
                  className={styles.addItemButton}
                >
                  افزودن کالا
                </Button>
              </Box>
            </>
          )}

          {/* Buyer Form - Same as Seller */}
          {formData.myRole === "خریدار" && (
            <>
              <TextField
                label="دسته‌بندی کالا"
                value={formData.itemCategory}
                onChange={handleChange("itemCategory")}
                fullWidth
                className={styles.field}
                variant="outlined"
              />

              <Box className={styles.row}>
                <TextField
                  label="نام کالا"
                  value={formData.itemName}
                  onChange={handleChange("itemName")}
                  fullWidth
                  className={styles.field}
                  variant="outlined"
                />

                <TextField
                  label="قیمت (تومان)"
                  value={formatNumber(formData.price)}
                  onChange={handleNumberChange("price")}
                  className={styles.field}
                  variant="outlined"
                  InputProps={{
                    endAdornment: <span style={{ marginLeft: 8 }}>تومان</span>,
                  }}
                />
              </Box>

              <TextField
                label="توضیحات کالا"
                value={formData.itemDescription}
                onChange={handleChange("itemDescription")}
                fullWidth
                multiline
                rows={4}
                className={styles.field}
                variant="outlined"
              />

              <Box className={styles.buttonContainer}>
                <Button
                  variant="contained"
                  onClick={handleAddItem}
                  className={styles.addItemButton}
                >
                  افزودن کالا
                </Button>
              </Box>
            </>
          )}

          {/* Broker Form */}
          {formData.myRole === "کارگزار" && (
            <>
              <TextField
                label="دسته‌بندی کالا"
                value={formData.itemCategory}
                onChange={handleChange("itemCategory")}
                fullWidth
                className={styles.field}
                variant="outlined"
              />

              <Box className={styles.row}>
                <TextField
                  label="نام کالا"
                  value={formData.itemName}
                  onChange={handleChange("itemName")}
                  fullWidth
                  className={styles.field}
                  variant="outlined"
                />

                <TextField
                  label="قیمت (تومان)"
                  value={formatNumber(formData.price)}
                  onChange={handleNumberChange("price")}
                  className={styles.field}
                  variant="outlined"
                  InputProps={{
                    endAdornment: <span style={{ marginLeft: 8 }}>تومان</span>,
                  }}
                />

                <TextField
                  label="کارمزد کارگزار (تومان)"
                  value={formatNumber(formData.brokerCommission)}
                  onChange={handleNumberChange("brokerCommission")}
                  className={styles.field}
                  variant="outlined"
                  InputProps={{
                    endAdornment: <span style={{ marginLeft: 8 }}>تومان</span>,
                  }}
                />
              </Box>

              <TextField
                label="توضیحات کالا"
                value={formData.itemDescription}
                onChange={handleChange("itemDescription")}
                fullWidth
                multiline
                rows={4}
                className={styles.field}
                variant="outlined"
              />

              <Box className={styles.buttonContainer}>
                <Button
                  variant="contained"
                  onClick={handleAddItem}
                  className={styles.addItemButton}
                >
                  افزودن کالا
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}


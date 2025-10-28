"use client"

import React, { useState } from "react";
import { Modal, Box, Typography, TextField, MenuItem } from "@mui/material";
import { Button } from "@/components/ui/button";

interface CreateProductModalProps {
  categories: string[];
  locations: string[];
}

export default function CreateProductModal({ categories, locations }: CreateProductModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    location: "",
    unitPrice: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setErrors({});
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" })); // clear field error
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required.";
    if (!formData.category) newErrors.category = "Category is required.";
    if (!formData.location) newErrors.location = "Location is required.";
    if (!formData.unitPrice) newErrors.unitPrice = "Unit price is required.";
    if (!formData.description.trim()) newErrors.description = "Description is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    console.log("New product data:", formData);
    handleClose();
  };

  const isFormComplete = Object.values(formData).every(v => v.trim() !== "");

  return (
    <div>
      {/* Trigger button */}
      <Button variant="default" onClick={handleOpen}>
        + Create Product
      </Button>

      {/* Modal itself */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="create-product-modal-title"
        aria-describedby="create-product-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="create-product-modal-title" variant="h6" component="h2" mb={2}>
            Create New Product
          </Typography>

          {/* Form fields */}
          <TextField
            fullWidth
            label="Product Name"
            variant="outlined"
            margin="normal"
            value={formData.name}
            onChange={e => handleChange("name", e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
          />

          <TextField
            select
            fullWidth
            label="Category"
            variant="outlined"
            margin="normal"
            value={formData.category}
            onChange={e => handleChange("category", e.target.value)}
            error={!!errors.category}
            helperText={errors.category}
          >
            {categories.map((cat, idx) => (
              <MenuItem key={idx} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Location"
            variant="outlined"
            margin="normal"
            value={formData.location}
            onChange={e => handleChange("location", e.target.value)}
            error={!!errors.location}
            helperText={errors.location}
          >
            {locations.map((loc, idx) => (
              <MenuItem key={idx} value={loc}>
                {loc}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Unit Price"
            variant="outlined"
            margin="normal"
            type="number"
            value={formData.unitPrice}
            onChange={e => handleChange("unitPrice", e.target.value)}
            error={!!errors.unitPrice}
            helperText={errors.unitPrice}
          />

          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            margin="normal"
            multiline
            minRows={3}
            value={formData.description}
            onChange={e => handleChange("description", e.target.value)}
            inputProps={{ style: { whiteSpace: "pre-wrap" } }}
            error={!!errors.description}
            helperText={errors.description}
          />

          {/* Action buttons */}
          <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={handleClose} color="inherit">
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSubmit}
              disabled={!isFormComplete}
            >
              Create
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

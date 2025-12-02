"use client";

import React, { useState } from "react";
import { Modal, Box, Typography, TextField, MenuItem } from "@mui/material";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";
import type { CategoryOption } from "@/components/products/create-product-modal";

interface EditProductModalProps {
  product: Product;
  categories: CategoryOption[];
  locations: string[];
  onUpdateProduct?: (productId: string, data: {
    name?: string;
    categoryId?: string;
    price?: number;
    description?: string;
    lowStockThreshold?: number;
  }) => Promise<void>;
}

export default function EditProductModal({ product, categories, locations, onUpdateProduct }: EditProductModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: product.name || "",
    categoryId: "", // still let user choose a new category if desired
    unitPrice: product.unitPrice?.toString() ?? "",
    description: product.description || "",
    lowStockThreshold: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    if (loading) return;
    setOpen(false);
    setError(null);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!onUpdateProduct || !product.id) {
      setError("Update function not provided or product id missing");
      return;
    }

    const payload: {
      name?: string;
      categoryId?: string;
      price?: number;
      description?: string;
      lowStockThreshold?: number;
    } = {};

    if (formData.name.trim() !== "" && formData.name.trim() !== product.name) {
      payload.name = formData.name.trim();
    }

    if (formData.categoryId.trim() !== "") {
      payload.categoryId = formData.categoryId.trim();
    }

    if (formData.unitPrice.trim() !== "") {
      const priceNum = Number(formData.unitPrice);
      if (!Number.isFinite(priceNum) || priceNum < 0) {
        setError("Unit price must be a non-negative number");
        return;
      }
      if (priceNum !== product.unitPrice) {
        payload.price = priceNum;
      }
    }

    if (formData.description.trim() !== "" && formData.description.trim() !== (product.description || "")) {
      payload.description = formData.description.trim();
    }

    if (formData.lowStockThreshold.trim() !== "") {
      const tNum = Number(formData.lowStockThreshold);
      if (!Number.isFinite(tNum)) {
        setError("Low stock threshold must be a number");
        return;
      }
      payload.lowStockThreshold = tNum > 0 ? tNum : -1;
    }

    if (Object.keys(payload).length === 0) {
      setError("No changes to save");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onUpdateProduct(product.id, payload);
      setOpen(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const isFormComplete = formData.name.trim() !== "" && formData.unitPrice.trim() !== "";

  return (
    <>
      <Button variant="outline" onClick={handleOpen} disabled={!product.id}>
        Edit
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="edit-product-modal-title"
        aria-describedby="edit-product-modal-description"
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
          <Typography id="edit-product-modal-title" variant="h6" component="h2" mb={2}>
            Edit Product
          </Typography>

          <TextField
            fullWidth
            label="Product Name"
            variant="outlined"
            margin="normal"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <TextField
            select
            fullWidth
            label="Category"
            variant="outlined"
            margin="normal"
            value={formData.categoryId}
            onChange={(e) => handleChange("categoryId", e.target.value)}
            helperText={"Leave blank to keep current category"}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
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
            onChange={(e) => handleChange("unitPrice", e.target.value)}
          />

          <TextField
            fullWidth
            label="Low Stock Threshold (optional)"
            variant="outlined"
            margin="normal"
            type="number"
            helperText="If blank or non-positive, alerts are disabled for this product."
            value={formData.lowStockThreshold}
            onChange={(e) => handleChange("lowStockThreshold", e.target.value)}
          />

          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            margin="normal"
            multiline
            minRows={3}
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            inputProps={{ style: { whiteSpace: "pre-wrap" } }}
          />

          {error && (
            <Typography color="error" mt={1}>
              {error}
            </Typography>
          )}

          <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={handleClose} color="inherit" disabled={loading}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleSubmit} disabled={!isFormComplete || loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

"use client"

import React, { useState } from "react";
import { Modal, Box, Typography, TextField, MenuItem } from "@mui/material";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export type CategoryOption = { id: string; name: string };

interface CreateProductModalProps {
  categories: CategoryOption[];
  locations: string[]; // Expect: ["Boston", "Seattle", "Oakland"]
  onCreated?: () => void;
}

export default function CreateProductModal({ categories, locations, onCreated }: CreateProductModalProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        categoryId: "",
        location: "",
        unitPrice: "",
        description: "",
    });


    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };


        const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

        const handleSubmit = async () => {
            try {
                setLoading(true);
                setError(null);

                const priceNum = Number(formData.unitPrice);
                if (!Number.isFinite(priceNum) || priceNum < 0) {
                    setError("Unit price must be a non-negative number");
                    setLoading(false);
                    return;
                }

                const res = await fetch(`${apiBase}/products`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: formData.name.trim(),
                        categoryId: formData.categoryId,
                        location: formData.location, // Must be Boston | Seattle | Oakland
                        price: priceNum,
                    }),
                });
                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data?.error || `Failed to create product (${res.status})`);
                }

                // Reset and refresh
                setFormData({ name: "", categoryId: "", location: "", unitPrice: "", description: "" });
                setOpen(false);
                onCreated?.();
                router.refresh();
            } catch (e: any) {
                setError(e?.message || "Failed to create product");
            } finally {
                setLoading(false);
            }
        };

    const isFormComplete = formData.name.trim() !== "" && formData.categoryId.trim() !== "" && formData.location.trim() !== "" && formData.unitPrice.trim() !== "";

    return (
        <div>
            {/* Trigger button */}
            <Button variant="default" onClick={handleOpen}>
                <PlusCircle />
                Create Product
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
                    />

                    <TextField
                        select
                        fullWidth
                        label="Category"
                        variant="outlined"
                        margin="normal"
                        value={formData.categoryId}
                        onChange={e => handleChange("categoryId", e.target.value)}
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                                {cat.name}
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
                    >
                        {locations.map((loc) => (
                            <MenuItem key={loc} value={loc}>
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
                    />

                    {/* Action buttons */}
                    {error && (
                      <Typography color="error" mt={1}>{error}</Typography>
                    )}
                    <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
                        <Button onClick={handleClose} color="inherit" disabled={loading}>
                            Cancel
                        </Button>
                        <Button
                            variant="default"
                            onClick={handleSubmit}
                            disabled={!isFormComplete || loading}
                        >
                            {loading ? "Saving..." : "Create"}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}

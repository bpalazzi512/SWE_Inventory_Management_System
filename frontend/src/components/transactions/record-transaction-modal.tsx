"use client"

import React, { useState } from "react";
import { Modal, Box, Typography, TextField, MenuItem } from "@mui/material";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

type TxType = "IN" | "OUT";

interface Props {
  onCreateTransaction?: (data: {
    sku: string;
    type: "IN" | "OUT";
    quantity: number;
    description?: string;
  }) => Promise<void>;
  onCreated?: () => void;
}

export default function RecordTransactionModal({ onCreateTransaction, onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<{
    sku: string;
    type: TxType;
    quantity: string;
    description: string;
  }>({ sku: "", type: "IN", quantity: "", description: "" });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    if (loading) return;
    setOpen(false);
    setError(null);
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isComplete = form.sku.trim() !== "" && form.quantity.trim() !== "";

  const handleSubmit = async () => {
    if (!onCreateTransaction) {
      setError("Transaction creation function not provided");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await onCreateTransaction({
        sku: form.sku.trim(),
        type: form.type,
        quantity: Number(form.quantity),
        description: form.description?.trim() || undefined,
      });

      // Reset and close
      setForm({ sku: "", type: "IN", quantity: "", description: "" });
      setOpen(false);
      onCreated?.();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to record transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button variant="default" onClick={handleOpen}>
        <PlusCircle />
        Record Stock In/Out
      </Button>

      <Modal open={open} onClose={handleClose} aria-labelledby="record-transaction-modal">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 520,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="record-transaction-modal" variant="h6" component="h2" mb={2}>
            Record Stock In/Out
          </Typography>

          <TextField
            fullWidth
            label="SKU"
            variant="outlined"
            margin="normal"
            value={form.sku}
            onChange={(e) => handleChange("sku", e.target.value)}
          />

          <TextField
            select
            fullWidth
            label="Type"
            variant="outlined"
            margin="normal"
            value={form.type}
            onChange={(e) => handleChange("type", e.target.value)}
          >
            {(["IN", "OUT"] as TxType[]).map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Quantity"
            variant="outlined"
            margin="normal"
            type="number"
            inputProps={{ min: 1 }}
            value={form.quantity}
            onChange={(e) => handleChange("quantity", e.target.value)}
          />

          <TextField
            fullWidth
            label="Description (optional)"
            variant="outlined"
            margin="normal"
            multiline
            minRows={2}
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
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
            <Button variant="default" onClick={handleSubmit} disabled={!isComplete || loading}>
              {loading ? "Saving..." : "Submit"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

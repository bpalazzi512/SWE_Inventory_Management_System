"use client"

import React, { useState } from "react";
import { Modal, Box, Typography, TextField, MenuItem } from "@mui/material";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface AddUserModalProps {
  onAddUser?: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  onCreated?: () => void;
}

export default function AddUserModal({ onAddUser, onCreated }: AddUserModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        if (loading) return;
        setOpen(false);
        setError(null);
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!onAddUser) {
            setError("Add user function not provided");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const email = formData.email.trim();
            if (!email || !email.includes("@")) {
                setError("A valid email address is required");
                setLoading(false);
                return;
            }

            await onAddUser({
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                password: formData.password,
            });

            // Reset and close
            setFormData({ firstName: "", lastName: "", email: "", password: "" });
            setOpen(false);
            onCreated?.();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Failed to add user");
        } finally {
            setLoading(false);
        }
    };

    const isFormComplete = formData.firstName.trim() !== "" && formData.lastName.trim() !== "" && formData.email.trim() !== "" && formData.password.trim() !== "";

    return (
        <div>
            {/* Trigger button */}
            <Button variant="default" onClick={handleOpen}>
                <PlusCircle />
                Add User
            </Button>

            {/* Modal itself */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="add-user-modal-title"
                aria-describedby="add-user-modal-description"
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
                    <Typography id="add-user-modal-title" variant="h6" component="h2" mb={2}>
                        Add New User
                    </Typography>

                    {/* Form fields */}
                    <TextField
                        fullWidth
                        label="First Name"
                        variant="outlined"
                        margin="normal"
                        value={formData.firstName}
                        onChange={e => handleChange("firstName", e.target.value)}
                    />

                    <TextField
                        fullWidth
                        label="Last Name"
                        variant="outlined"
                        margin="normal"
                        value={formData.lastName}
                        onChange={e => handleChange("lastName", e.target.value)}
                    />

                    

                    <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        margin="normal"
                        value={formData.email}
                        onChange={e => handleChange("email", e.target.value)}
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        variant="outlined"
                        margin="normal"
                        value={formData.password}
                        onChange={e => handleChange("password", e.target.value)}
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

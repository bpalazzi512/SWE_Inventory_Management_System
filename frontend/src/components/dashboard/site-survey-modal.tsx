"use client";

import React, { useState } from "react";
import { Modal, Box, Typography, MenuItem, TextField } from "@mui/material";
import { Button } from "@/components/ui/button";

export default function SiteSurveyModal() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    appearance: "",
    navigation: "",
    easeOfUse: "",
    recommend: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log("Survey submitted:", formData);
    handleClose();
  };

  const isFormComplete = Object.values(formData).every((v) => v.trim() !== "");

  const ratingOptions = ["Excellent", "Good", "Fair", "Poor"];
  const recommendOptions = ["Yes", "No"];

  return (
    <div>
      {/* Trigger button */}
      <button
        onClick={handleOpen}
        className="text-primary hover:underline text-sm text-left cursor-pointer"
      >
        Site Survey
      </button>

      {/* Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="site-survey-title"
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
          <Typography
            id="site-survey-title"
            variant="h6"
            component="h2"
            mb={1.5}
            sx={{ fontWeight: 600 }}
          >
            Site Survey
          </Typography>

          <Typography variant="body2" mb={2}>
            Tell us what you think! We are always interested in feedback about
            the design and usability of the site.
          </Typography>

          <Typography variant="subtitle1" mb={1} sx={{ fontWeight: 600 }}>
            Please rate the following:
          </Typography>

          {/* Dropdown fields */}
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              select
              label="Appearance"
              fullWidth
              value={formData.appearance}
              onChange={(e) => handleChange("appearance", e.target.value)}
            >
              {ratingOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Navigation"
              fullWidth
              value={formData.navigation}
              onChange={(e) => handleChange("navigation", e.target.value)}
            >
              {ratingOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Ease-of-use"
              fullWidth
              value={formData.easeOfUse}
              onChange={(e) => handleChange("easeOfUse", e.target.value)}
            >
              {ratingOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Would you recommend this site to a friend?"
              fullWidth
              value={formData.recommend}
              onChange={(e) => handleChange("recommend", e.target.value)}
            >
              {recommendOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Submit button */}
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              onClick={handleSubmit}
              disabled={!isFormComplete}
              variant="default"
            >
              Submit Survey
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

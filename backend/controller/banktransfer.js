const express = require("express");
const multer = require("multer");
const router = express.Router();
const BankTransfer = require("../model/banktransfer");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // specify your uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Create a new Bank Transfer
router.post(
  "/create-bank-transfer",
  upload.single('file'), // expecting a single file with the field name 'file'
  catchAsyncErrors(async (req, res) => {
    try {
      const { email } = req.body;
      const file = req.file ? req.file.path : null;

      if (!file) {
        return res.status(400).json({
          success: false,
          message: "File upload is required"
        });
      }

      const bankTransfer = new BankTransfer({
        email,
        file
      });

      await bankTransfer.save();

      res.status(201).json({
        success: true,
        message: "Bank transfer uploaded successfully🙂",
        data: bankTransfer
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message
      });
    }
  })
);

// Read all Bank Transfers
router.get(
  "/get-all-bank-transfers",
  catchAsyncErrors(async (req, res) => {
    try {
      const bankTransfers = await BankTransfer.find();
      res.status(200).json({
        success: true,
        message: "Bank transfers retrieved successfully",
        data: bankTransfers
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message
      });
    }
  })
);

// Read a single Bank Transfer by ID
router.get(
  "/get-bank-transfer/:id",
  catchAsyncErrors(async (req, res) => {
    try {
      const bankTransfer = await BankTransfer.findById(req.params.id);
      if (!bankTransfer) {
        return res.status(404).json({
          success: false,
          message: "Bank transfer not found"
        });
      }
      res.status(200).json({
        success: true,
        message: "Bank transfer retrieved successfully",
        data: bankTransfer
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message
      });
    }
  })
);

// Update a Bank Transfer by ID
router.put(
  "/update-bank-transfer/:id",
  upload.single('file'), // to allow file replacement if needed
  catchAsyncErrors(async (req, res) => {
    try {
      const { email } = req.body;
      const file = req.file ? req.file.path : undefined;

      const updateData = { email };
      if (file) updateData.file = file;

      const bankTransfer = await BankTransfer.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!bankTransfer) {
        return res.status(404).json({
          success: false,
          message: "Bank transfer not found"
        });
      }

      res.status(200).json({
        success: true,
        message: "Bank transfer updated successfully",
        data: bankTransfer
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message
      });
    }
  })
);

// Delete a Bank Transfer by ID
router.delete(
  "/delete-bank-transfer/:id",
  catchAsyncErrors(async (req, res) => {
    try {
      const bankTransfer = await BankTransfer.findByIdAndDelete(req.params.id);
      if (!bankTransfer) {
        return res.status(404).json({
          success: false,
          message: "Bank transfer not found"
        });
      }
      res.status(200).json({
        success: true,
        message: "Bank transfer deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message
      });
    }
  })
);

module.exports = router;

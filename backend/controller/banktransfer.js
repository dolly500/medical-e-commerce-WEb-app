const express = require("express");
const cloudinary = require("cloudinary");
const router = express.Router();
const BankTransfer = require("../model/banktransfer");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const multer = require("multer");
const path = require("path")

const multerConfigs = {
  storage: multer.diskStorage({
    destination: (req,file,cb) => {
      return cb(null, path.join(__dirname, "images"));
    },
    filename: (req, file, cb) => {
      return cb(
        null,
        `${new Date().getTime() * Math.random()}${file.originalname}`
      );
    },
  }),

  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes('image')) {
      return cb(null, true);
    } else {
      return cb(null, false);
    }
  },
};

const upload = multer(multerConfigs);

// Create a new Bank Transfer
router.post(
  "/create-bank-transfer",
  upload.single('image'),
  catchAsyncErrors(async (req, res) => {
    try {
      const { email } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          message: "File upload is required",
        });
      }

      // Upload file to Cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "bank-transfers",
      });

      // Save transfer info with Cloudinary data in the database
      const bankTransfer = new BankTransfer({
        email,
        file: result.secure_url
      });

      await bankTransfer.save();

      res.status(201).json({
        success: true,
        message: "Bank transfer uploaded successfully🙂",
        data: bankTransfer,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
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

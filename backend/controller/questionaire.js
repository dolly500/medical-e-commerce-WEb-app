const express = require("express");
const router = express.Router();
const Questionnaire = require("../model/questionaire");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");


// Create a new Tracking Number 
router.post(
  "/create-questionnaire",
  catchAsyncErrors(async (req, res) => {
    try {
      const { trackingNumber, email } = req.body;
      const questionnaire = new Questionnaire({
        trackingNumber,
        email
      });

      await questionnaire.save();

      res.status(201).json({
        success: true,
        message: "Tracking created successfully🙂",
        data: questionnaire
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


// Read all Tracking
router.get(
  "/get-all-questionnaire",
  catchAsyncErrors(async (req, res) => {
    try {
      const questionnaires = await Questionnaire.find();
      res.status(200).json({
        success: true,
        message: "Tracking retrieved successfully",
        data: questionnaires
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

// Read a single Tracking by ID
router.get(
  "/get-all-questionnaire/:id",
  catchAsyncErrors(async (req, res) => {
    try {
      const questionnaire = await Questionnaire.findById(req.params.id);
      if (!questionnaire) {
        return res.status(404).json({
          success: false,
          message: "Tracking not found"
        });
      }
      res.status(200).json({
        success: true,
        message: "Tracking retrieved successfully",
        data: questionnaire
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

// Update a Tracking by ID
router.put(
  "/:id",
  catchAsyncErrors(async (req, res) => {
    try {
      const { trackingNumber, email } = req.body;
      const questionnaire = await Questionnaire.findByIdAndUpdate(
        req.params.id,
        { trackingNumber, email },
        { new: true, runValidators: true }
      );

      if (!questionnaire) {
        return res.status(404).json({
          success: false,
          message: "Tracking not found"
        });
      }

      res.status(200).json({
        success: true,
        message: "Tracking updated successfully",
        data: questionnaire
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


// Delete a Tracking by ID
router.delete(
  "/:id",
  catchAsyncErrors(async (req, res) => {
    try {
      const questionnaire = await Questionnaire.findByIdAndDelete(req.params.id);
      if (!questionnaire) {
        return res.status(404).json({
          success: false,
          message: "Tracking not found"
        });
      }
      res.status(200).json({
        success: true,
        message: "Tracking deleted successfully"
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
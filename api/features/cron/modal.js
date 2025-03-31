const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const CronjobSchema = new mongoose.Schema(
  {
    CronjobId: {
        type: String, // Change type to String for UUID
        default: uuidv4, // Assign UUID by default
        unique: true, // Ensure uniqueness
      },
    Name: {
      type: String,
      required: true,
    },
    Record: {
      type: String,
      required: true,
    },
    Total: {
      type: Number,
      default: 0,
    },
    InsertedRows: {
      type: Number,
      default: 0,
    },
    TotalRows: {
      type: Number,
    },
    Processed: {
      type: Boolean,
      default: false,
    },
    Status: {
      type: String,
      default: "Pending",
    },
    Time: {
      type: String,
      required: true,
    },
    IsCronjob_running: {
      type: Boolean,
      default: false,
    },
    IsDelete: {
      type: Boolean,
      default: false,
    },
    IsNatural: {
      type: Boolean,
      default: false,
    },
    IsLabgrown: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cronjob", CronjobSchema);

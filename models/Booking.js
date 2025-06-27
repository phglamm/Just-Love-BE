const mongoose = require("mongoose");
const BookingSchema = mongoose.Schema(
  {
    BookingName: {
      type: String,
      required: true,
      unique: true,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
    createBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      default: "685e92b227d74661e2afcd18", // Default to a specific user ID
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);

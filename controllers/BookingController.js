const Booking = require("../models/Booking");
const User = require("../models/User");
const mongoose = require("mongoose");

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("createBy bookingFor");
    res.status(200).json({
      message: "Bookings retrieved successfully.",
      data: bookings,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: 500 });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Invalid booking ID.", status: 400 });
    }
    const booking = await Booking.findById(id).populate("createBy bookingFor");
    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
        status: 404,
      });
    }
    res.status(200).json({
      message: "Booking retrieved successfully.",
      data: booking,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: 500 });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { createBy, bookingFor } = req.body;
    if (
      !mongoose.Types.ObjectId.isValid(createBy) ||
      !mongoose.Types.ObjectId.isValid(bookingFor)
    ) {
      return res.status(400).json({ message: "Invalid user ID.", status: 400 });
    }

    const newBooking = await Booking.create(req.body);
    res.status(201).json({
      message: "Booking created successfully.",
      data: newBooking,
      status: 201,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: 500 });
  }
};
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedBooking) {
      return res.status(404).json({
        message: "Booking not found.",
        status: 404,
      });
    }
    res.status(200).json({
      message: "Booking updated successfully.",
      data: updatedBooking,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: 500 });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBooking = await Booking.findByIdAndDelete(id);
    if (!deletedBooking) {
      return res.status(404).json({
        message: "Booking not found.",
        status: 404,
      });
    }
    res.status(200).json({
      message: "Booking deleted successfully.",
      status: 200,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: 500 });
  }
};

exports.approveBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
        status: 404,
      });
    }
    booking.status = "Confirmed";
    const updatedBooking = await booking.save();
    res.status(200).json({
      message: "Booking approved successfully.",
      data: updatedBooking,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: 500 });
  }
};
exports.rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
        status: 404,
      });
    }
    booking.status = "Cancelled";
    const updatedBooking = await booking.save();
    res.status(200).json({
      message: "Booking rejected successfully.",
      data: updatedBooking,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: 500 });
  }
};

const express = require("express");
const router = express.Router();
const BookingController = require("../controllers/BookingController");
const { authenticateUser } = require("../middleware/authMiddleware");

router
  .get("/", authenticateUser, BookingController.getBookings)
  .post("/", authenticateUser, BookingController.createBooking)
  .get("/:id", authenticateUser, BookingController.getBookingById)
  .put("/:id", authenticateUser, BookingController.updateBooking)
  .delete("/:id", authenticateUser, BookingController.deleteBooking)
  .put("/:id/approve", authenticateUser, BookingController.approveBooking)
  .put("/:id/reject", authenticateUser, BookingController.rejectBooking);

module.exports = router;

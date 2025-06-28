var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const connectDb = require("./config/database");
const cors = require("cors");
const authRouter = require("./routes/authRouter");
const bookingRouter = require("./routes/bookingRouter");
const memoryRouter = require("./routes/memoryRouter");
var app = express();

connectDb();

app.use(logger("dev"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/memory", memoryRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  const errorResponse = {
    message: err.message,
    status: err.status || 500,
  };

  // Only include error details in development
  if (req.app.get("env") === "development") {
    errorResponse.error = err;
  }

  res.status(err.status || 500).json(errorResponse);
});

module.exports = app;

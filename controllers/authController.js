const mongoose = require("mongoose");
const crypto = require("crypto");
const transporter = require("../config/nodemailer");
const jwt = require("jsonwebtoken");
const user = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  try {
    const { username } = req.body;
    const existingUser = await user.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await user.create(req.body);
    const responseUser = {
      _id: newUser._id,
      username: newUser.username,
      fullname: newUser.fullname,
      phone: newUser.phone,
      email: newUser.email,
    };
    res.status(201).json({
      message: "User registered successfully.",
      responseUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const userLogin = await user.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }

    const isMatch = await userLogin.comparePassword(password);
    if (!isMatch) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }

    const responseUser = {
      _id: userLogin._id,
      username: userLogin.username,
      fullname: userLogin.fullname,
      phone: userLogin.phone,
      email: userLogin.email,
      gender: userLogin.gender,
      role: userLogin.role,
    };

    const token = jwt.sign({ user: responseUser }, JWT_SECRET, {
      expiresIn: "2h",
    });

    res.status(200).json({ accessToken: token, user: responseUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

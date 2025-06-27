const Memories = require("../models/Memories");
const User = require("../models/User");

exports.getMemories = async (req, res) => {
  try {
    const memories = await Memories.find()
      .populate("createdBy", "_id username fullName")
      .select("_id name imageUrl description createdAt createdBy");
    res.status(200).json({
      message: "Memories retrieved successfully.",
      data: memories,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: 500 });
  }
};

exports.createMemory = async (req, res) => {
  try {
    // Get createdBy from decoded token instead of request body
    const createdBy = req.user.id || req.user._id;
    console.log("Created By:", createdBy);
    if (!req.body.imageUrl) {
      return res.status(400).json({
        message: "Image URL is required.",
        status: 400,
      });
    }
    if (!req.body.name) {
      return res.status(400).json({
        message: "Name is required.",
        status: 400,
      });
    }

    // Check if user exists using User model
    const userExists = await User.findById(createdBy);
    if (!userExists) {
      return res.status(404).json({
        message: "User not found.",
        status: 404,
      });
    }

    const isNameTaken = await Memories.findOne({
      name: req.body.name,
    });
    if (isNameTaken) {
      return res.status(400).json({
        message: "Memory name already exists.",
        status: 400,
      });
    }

    // Create memory with createdBy from token
    const memoryData = {
      ...req.body,
      createdBy: createdBy,
    };

    const newMemory = await Memories.create(memoryData);
    res.status(201).json({
      message: "Memory created successfully.",
      data: newMemory,
      status: 201,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: 500 });
  }
};

exports.updateMemory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMemory = await Memories.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedMemory) {
      return res.status(404).json({
        message: "Memory not found.",
        status: 404,
      });
    }
    res.status(200).json({
      message: "Memory updated successfully.",
      data: updatedMemory,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: 500 });
  }
};

exports.deleteMemory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMemory = await Memories.findByIdAndDelete(id);
    if (!deletedMemory) {
      return res.status(404).json({
        message: "Memory not found.",
        status: 404,
      });
    }
    res.status(200).json({
      message: "Memory deleted successfully.",
      status: 200,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: 500 });
  }
};

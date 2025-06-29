// controllers/memoriesController.js
const Memories = require("../models/Memories");
const User = require("../models/User");
const appwriteService = require("../config/appwrite");

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
    // Get createdBy from decoded token
    const createdBy = req.user.id || req.user._id;
    console.log("Created By:", createdBy);
    console.log("Request file:", req.file);
    console.log("Request body:", req.body);

    if (!req.file) {
      return res.status(400).json({
        message: "Image file is required.",
        status: 400,
      });
    }

    if (!req.body.name) {
      return res.status(400).json({
        message: "Name is required.",
        status: 400,
      });
    }

    // Check if user exists
    const userExists = await User.findById(createdBy);
    if (!userExists) {
      return res.status(404).json({
        message: "User not found.",
        status: 404,
      });
    }

    // Check if memory name already exists
    const isNameTaken = await Memories.findOne({
      name: req.body.name,
    });
    if (isNameTaken) {
      return res.status(400).json({
        message: "Memory name already exists.",
        status: 400,
      });
    }

    // Upload image to Appwrite
    console.log(
      "Uploading to Appwrite with buffer size:",
      req.file.buffer.length
    );
    console.log("Original filename:", req.file.originalname);

    const uploadResult = await appwriteService.uploadFile(
      req.file.buffer,
      req.file.originalname
    );

    if (!uploadResult.success) {
      return res.status(500).json({
        message: "Failed to upload image.",
        error: uploadResult.error,
        status: 500,
      });
    }

    // Create memory with uploaded image URL
    const memoryData = {
      name: req.body.name,
      description: req.body.description || "",
      imageUrl: uploadResult.fileUrl,
      createdBy: createdBy,
    };

    const newMemory = await Memories.create(memoryData);

    // Populate the created memory
    const populatedMemory = await Memories.findById(newMemory._id).populate(
      "createdBy",
      "_id username fullName"
    );

    res.status(201).json({
      message: "Memory created successfully with image.",
      data: {
        ...populatedMemory.toObject(),
        fileId: uploadResult.fileId,
      },
      status: 201,
    });
  } catch (error) {
    console.error("Error creating memory with image:", error);
    res.status(500).json({
      message: error.message,
      status: 500,
    });
  }
};

exports.deleteMemory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the memory first to get the file ID for deletion
    const memory = await Memories.findById(id);
    if (!memory) {
      return res.status(404).json({
        message: "Memory not found.",
        status: 404,
      });
    }

    // Extract file ID from imageUrl if needed for deletion
    // This assumes your imageUrl contains the file ID
    // You might want to store fileId separately in your schema

    const deletedMemory = await Memories.findByIdAndDelete(id);

    // Optionally delete the image from Appwrite
    // If you stored fileId in your memory document:
    // await appwriteService.deleteFile(memory.fileId);

    res.status(200).json({
      message: "Memory deleted successfully.",
      status: 200,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: 500 });
  }
};

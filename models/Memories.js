const mongoose = require("mongoose");
const MemorySchem = mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      unique: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Memories", MemorySchem);

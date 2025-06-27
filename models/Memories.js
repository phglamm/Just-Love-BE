const mongoose = require("mongoose");
const MemorySchema = mongoose.Schema(
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Memories", MemorySchema);

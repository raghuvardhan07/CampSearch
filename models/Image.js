const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
});

const ImageSchema = mongoose.Schema(
  {
    uploadedBy: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imagePath: {
      type: String,
      required: true,
    },
    reviews: [ReviewSchema], // Now reviews is an array of ReviewSchema objects
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Images", ImageSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["Monument", "Museum", "Religious Site", "Palace/Castle"],
  },
  historicalPeriod: { type: String, required: true },
  description: { type: String },
  tags: [{ type: String }],
});

const tourismGovernerTag = mongoose.model("tourismGovernerTag", LocationSchema);
module.exports = tourismGovernerTag;

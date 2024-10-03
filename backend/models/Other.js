const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OtherSchema = new Schema(
  {
    UserName: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },
    AccountType: {
      type: String,
      enum: ["Advertiser", "Tour Guide", "Seller"], // Only these values are allowed
      required: true,
    },
  },
  { timestamps: true }
);

const Other = mongoose.model("Other", OtherSchema);
module.exports = Other;

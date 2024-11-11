const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SellerSchema = new Schema(
  {
    UserName: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    Password: {
      type: String,
      required: true,
    },
    IDDocument: {
      type: String,
      required: true,
    },
    TaxationRegistryCard: {
      type: String,
      required: true,
    },
    Name: {
      type: String,
      required: false,
    },
    PickUp_Location: {
      type: String,
      required: false,
    },
    Type_Of_Products: {
      type: String,
      required: false,
    },
    Previous_Work: {
      type: String,
      required: false,
    },
    Age: {
      type: Number,
      required: false,
    },
    logo: {
      type: String,
      required: false,
    },
    Profile_Completed: {
      type: Boolean,
      required: false,
    },
    Admin_Acceptance: { type: Boolean, default: null },
  },
  { timestamps: true }
);

const Seller = mongoose.model("Seller", SellerSchema);
module.exports = Seller;

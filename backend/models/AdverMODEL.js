const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const advertiserSchema = new Schema(
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
    Link: {
      type: String,
      required: false,
    },
    Hotline: {
      type: Number,
      required: false,
    },
    Profile: {
      type: String,
      required: false,
    },
    Loc: {
      type: String,
      required: false,
    },
    CompanyDes: {
      type: String,
      required: false,
    },
    Services: {
      type: String,
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
  },
  { timestamps: true }
);

const adver = mongoose.model("adver", advertiserSchema);
module.exports = adver;

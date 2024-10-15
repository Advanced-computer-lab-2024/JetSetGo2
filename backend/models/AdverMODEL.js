const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const advertiserSchema = new Schema(
  {
    Name: { type: String, required: true },
    Link: { type: String, required: true },
    Hotline: { type: Number, required: true },
    Mail: { type: String, required: true },
    Profile: { type: String, required: true },
    Loc: { type: String, required: true },
    CompanyDes: { type: String, required: true },
    Services: { type: String, required: true },
    logo: { type: String },
  },
  { timestamps: true }
);

const adver = mongoose.model("adver", advertiserSchema);
module.exports = adver;

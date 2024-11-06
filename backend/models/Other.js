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
      unique: true,
      lowercase: true,
    },
    Password: {
      type: String,
      required: true,
    },
    AccountType: {
      type: String,
      enum: ["TourGuide", "Advertiser", "Seller"],
      required: true,
    },
    IDDocument: {
      type: String,
      required: true,
    },
    Certificates: {
      type: String,
      required: function () {
        return this.AccountType === "TourGuide";
      },
    },
    TaxationRegistryCard: {
      type: String,
      required: function () {
        return (
          this.AccountType === "Advertiser" || this.AccountType === "Seller"
        );
      },
    },
  },
  { timestamps: true }
);

const Other = mongoose.model("Other", OtherSchema);
module.exports = Other;

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
    IDDocument: {
      type: String, // URL or path to the uploaded ID document (PDF or image)
      required: true,
    },
    Certificates: {
      type: String, // URL or path to the certificate document (PDF or image, only for Tour Guides)
      required: function () {
        return this.AccountType === "Tour Guide"; // Required only if the account type is "Tour Guide"
      },
    },
    TaxationRegistryCard: {
      type: String, // URL or path to the taxation registry document (PDF or image, for Advertisers/Sellers)
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

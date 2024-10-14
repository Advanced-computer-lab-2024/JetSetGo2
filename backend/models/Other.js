const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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
      enum: ['TourGuide', 'Advertiser', 'Seller', 'Admin'], // Ensure the AccountType values are consistent
      required: true,
    },
    IDDocument: {
      type: String,
      required: true,
    },
    Certificates: {
      type: String,
      required: function () {
        return this.AccountType === "TourGuide"; // Corrected the condition
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

// Hash password before saving
OtherSchema.pre("save", async function (next) {
  if (this.isModified("Password")) {
    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
  }
  next();
});

const Other = mongoose.model("Other", OtherSchema);
module.exports = Other;

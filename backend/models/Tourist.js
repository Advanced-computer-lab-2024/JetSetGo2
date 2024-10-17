const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const TouristSchema = new Schema(
  {
    Email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    UserName: {
      type: String,
      required: true,
      immutable: true,
    },
    Password: {
      type: String,
      required: true,
    },
    AccountType: {
      type: String,
      default: 'Tourist',
    },
    MobileNumber: {
      type: Number,
      required: true,
    },
    Nationality: {
      type: String,
      required: true,
    },
    DateOfBirth: {
      type: Date,
      required: true,
      immutable: true,
    },
    Job: {
      type: String,
      required: true,
    },
    Wallet: {
      type: Number,
      default: 0,
      immutable: true,
    },
  },
  { timestamps: true }
);

// Hash password before saving
TouristSchema.pre("save", async function (next) {
  if (this.isModified("Password")) {
    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
  }
  next();
});


const Tourist = mongoose.model("Tourist", TouristSchema);
module.exports = Tourist;

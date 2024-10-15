const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SellerSchema = new Schema(
  {
    _id: { // Use the same ID as in the Other schema
      type: Schema.Types.ObjectId,
      ref: 'Other',
      required: true
    },
    Name: {
      type: String,
      required: true,
    },
    PickUp_Location: {
      type: String,
      required: true,
    },
    Type_Of_Products: {
      type: String,
      required: true,
    },
    Previous_Work: {
      type: String,
      required: true,
    },
    Age: {
      type: Number,
      required: true,
    },
    Email: {
      type: String,
      required: true,
      match: /.+\@.+\..+/,
    },
    logo: { type: String },
  },
  { timestamps: true }
);

const Seller = mongoose.model("Seller", SellerSchema);
module.exports = Seller;

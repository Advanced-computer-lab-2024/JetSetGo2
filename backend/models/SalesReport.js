const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const salesReportSchema = new Schema(
  {
    reportDate: {
      type: Date,
      default: Date.now,
    },
    activityRevenue: {
      type: Number,
      required: true,
      default: 0,
    },
    itineraryRevenue: {
      type: Number,
      required: true,
      default: 0,
    },
    giftShopRevenue: {
      type: Number,
      required: true,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      required: true,
      default: 0,
    },
    appFee: {
      type: Number,
      required: true,
      default: 0,
    },
    products: [
        {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // Reference to the Product schema
          sales: { type: Number, required: true, default: 0 }, // Units sold of this product
          revenue: { type: Number, required: true, default: 0 }, // Revenue from this product
        },
      ],
  },
  { timestamps: true }
);

const SalesReport = mongoose.model("SalesReport", salesReportSchema);
module.exports = SalesReport;

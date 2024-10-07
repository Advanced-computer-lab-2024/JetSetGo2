  const mongoose = require('mongoose');
  const Schema = mongoose.Schema;

  const  SellerSchema = new Schema({
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
      match: /.+\@.+\..+/
    }

  }, { timestamps: true });

  const Seller = mongoose.model('Seller', SellerSchema);
  module.exports = Seller;
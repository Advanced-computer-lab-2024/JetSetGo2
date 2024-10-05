  const mongoose = require('mongoose');
  const Schema = mongoose.Schema;

  const  SellerSchema = new Schema({
    Name: {
      type: String,
      required: true,
    },
    
    Password: {
      type: String,
      required: true,
      minlength: 6,
    },
    Description: {
      type: String,
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
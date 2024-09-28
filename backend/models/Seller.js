const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const  SellerSchema = new Schema({
    
  UserName: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true
  }
 
  

}, { timestamps: true });

const Seller = mongoose.model('Seller', SellerSchema);
module.exports = Seller;
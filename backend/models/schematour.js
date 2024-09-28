const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: { type: String, required: true },
    activities :[{type : String, required : true}],
    locations :[{type: String, required :true}],
    timeline: [{type : String, required : true}],
    durationActivity : [{type : Number , required : true}],
    tourLanguage : [{type : String, required : true}],
    TourPrice : [{type : Number , required :true}],
    availableDates : [{type :[Date], required : true}],
    accesibility : [{type : String,required : true}],
    pickUpLoc : [{type : String,required : true}],
    DropOffLoc : [{type : String,required : true}],
    bookings: { type: Number, default: 0 }, },{

        timestamps: true
    

});
module.exports = mongoose.model('SchemaT', schema);
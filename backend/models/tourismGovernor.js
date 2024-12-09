
const mongoose = require('mongoose');

const tourismGovernorSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Path `username` is required.'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Path `password` is required.'],
    },
    
});

const TourismGovernor = mongoose.model('TourismGovernor', tourismGovernorSchema);
module.exports = TourismGovernor; // Ensure this line is present

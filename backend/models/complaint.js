const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    date: { type: Date, default: Date.now },
    touristId: { type: mongoose.Schema.Types.ObjectId, ref: "Tourist", required: true },
    status: { type: String, enum: ["pending", "resolved"], default: "pending" },
    reply: { type: String }, // New reply field
});

const ComplaintModel = mongoose.model("Complaint", ComplaintSchema);
module.exports = ComplaintModel;

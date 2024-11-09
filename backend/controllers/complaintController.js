const ComplaintModel = require('../models/complaint.js');

// Create a new complaint
const createComplaint = async (req, res) => {
    const { title, body, touristId, date } = req.body;
    
    try {
        const complaint = new ComplaintModel({
            title,
            body,
            date,
            touristId
        });
        await complaint.save();
        res.status(201).json({ message: "Complaint filed successfully", complaint });
    } catch (error) {
        console.error("Error saving complaint:", error); 
        res.status(500).json({ message: "Failed to file complaint", error });
    }
};

// Delete a complaint by ID
const deleteComplaint = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedComplaint = await ComplaintModel.findByIdAndDelete(id);

        if (!deletedComplaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.status(200).json({ message: "Complaint deleted successfully", complaint: deletedComplaint });
    } catch (error) {
        console.error("Error deleting complaint:", error);
        res.status(500).json({ message: "Error deleting complaint", error });
    }
};

// Get all complaints
const getComplaints = async (req, res) => {
    try {
        const complaints = await ComplaintModel.find().populate('touristId'); // Populate tourist details if needed
        res.status(200).json(complaints);
    } catch (error) {
        console.error("Error fetching complaints:", error);
        res.status(400).json({ error: error.message });
    }
};
const resolveComplaint = async (req, res) => {
    const { id } = req.params;
  
    try {
      const complaint = await ComplaintModel.findById(id);
  
      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }
  
      complaint.status = "resolved";
      await complaint.save();
  
      res.status(200).json({ message: "Complaint resolved", complaint });
    } catch (error) {
      console.error("Error resolving complaint:", error);
      res.status(500).json({ message: "Error resolving complaint", error });
    }
  };
  const replyToComplaint = async (req, res) => {
    const { id } = req.params;
    const { reply } = req.body;

    try {
        const complaint = await ComplaintModel.findById(id);

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        complaint.reply = reply;
        await complaint.save();

        res.status(200).json({ message: "Reply added to complaint", complaint });
    } catch (error) {
        console.error("Error replying to complaint:", error);
        res.status(500).json({ message: "Error replying to complaint", error });
    }
};
// Fetch complaints by tourist ID
const getComplaintsByTourist = async (req, res) => {
    const { touristId } = req.params;
    try {
      const complaints = await ComplaintModel.find({ touristId }).populate('touristId');
      res.status(200).json(complaints);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      res.status(400).json({ error: error.message });
    }
  };
  
  
  
module.exports = {
    createComplaint,
    deleteComplaint,
    getComplaints,
    resolveComplaint,
    replyToComplaint,
    getComplaintsByTourist
};
const touristModel = require("../models/Tourist.js");
const transportationModel = require("../models/TransportationCRUD.js");
const { default: mongoose } = require("mongoose");

const createTourist = async (req, res) => {
  // create a tourist after sign up
  const {
    Email,
    UserName,
    Password,
    MobileNumber,
    Nationality,
    DateOfBirth,
    Job,
  } = req.body;

  // Validation checks
  if (
    !Email ||
    !UserName ||
    !Password ||
    !MobileNumber ||
    !Nationality ||
    !DateOfBirth ||
    !Job
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Example: Validate Email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(Email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  // Example: Validate MobileNumber (it should be a number and not less than 10 digits)
  if (isNaN(MobileNumber) || MobileNumber.toString().length < 10) {
    return res
      .status(400)
      .json({ error: "Mobile number must be at least 10 digits." });
  }

  // Example: Validate DateOfBirth (it should be a valid date)
  const dob = new Date(DateOfBirth);
  if (isNaN(dob.getTime())) {
    return res.status(400).json({ error: "Invalid date of birth." });
  }

  try {
    const tourist = await touristModel.create({
      Email,
      UserName,
      Password,
      MobileNumber,
      Nationality,
      DateOfBirth,
      Job,
    });
    res.status(200).json(tourist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTourist = async (req, res) => {
  const { id } = req.params;
  const updateData = {};

  if (req.body.Email) updateData.Email = req.body.Email;
  if (req.body.UserName) updateData.UserName = req.body.UserName;
  if (req.body.Password) updateData.Password = req.body.Password;
  if (req.body.MobileNumber) updateData.MobileNumber = req.body.MobileNumber;
  if (req.body.Nationality) updateData.Nationality = req.body.Nationality;
  if (req.body.DateOfBirth) updateData.DateOfBirth = req.body.DateOfBirth;
  if (req.body.Job) updateData.Job = req.body.Job;
  if (req.body.Wallet) updateData.Wallet = req.body.Wallet;
  try {
    const updatetourist = await touristModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatetourist) {
      res.status(404).json({ error: "Tourist not found" });
    }
    res.status(200).json(updatetourist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTourist = async (req, res) => {
  try {
    const tourist = await touristModel.find({});
    res.status(200).json(tourist);
  } catch (error) {
    res.status(400).json({ error: error.messege });
  }
};

const getTouristById = async (req, res) => {
  const { id } = req.params;
  try {
    const tourist = await touristModel.findById(id);
    res.status(200).json(tourist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteTourist = async (req, res) => {
  console.log("Request to delete Tourist :", req.params.id); // Log the ID
  try {
    const { id } = req.params;
    const deletedTourist = await touristModel.findByIdAndDelete(id);

    if (!deletedTourist) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
      user: deletedTourist,
    });
  } catch (error) {
    console.error("Error deleting tourism governor:", error);
    res.status(500).json({
      message: "Error deleting user",
      error,
    });
  }
};


const bookTransportation = async (req, res) => {
  const { touristId, transportationId } = req.params;

  try {
    const transportation = await transportationModel.findById(transportationId);

    if (!transportation) {
      return res.status(404).json({ error: "Transportation not found" });
    }

    if (!transportation.isBookingOpen) {
      return res.status(400).json({ error: "Booking is closed for this transportation." });
    }

    if (transportation.seatsAvailable <= 0) {
      return res.status(400).json({ error: "No available seats." });
    }

    const tourist = await touristModel.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Decrement seat and close booking if seats reach 0
    transportation.seatsAvailable -= 1;
    if (transportation.seatsAvailable === 0) {
      transportation.isBookingOpen = false; // Close booking when no seats are left
    }
    await transportation.save();

    // Add the booked transportation to the tourist's bookings
    tourist.bookedTransportations.push(transportation._id);
    await tourist.save();

    res.status(200).json({
      message: "Transportation booked successfully",
      transportation,
      tourist,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBookedTransportations = async (req, res) => {
  const { touristId } = req.params;

  try {
    // Find the tourist without population to check if the array is correct
    const tourist = await touristModel.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    console.log("Booked Transportations before population:", tourist.bookedTransportations); // Log the IDs to see if they are correct

    // Now populate the booked transportations
    const populatedTourist = await touristModel
      .findById(touristId)
      .populate('bookedTransportations');

    console.log("Populated Booked Transportations:", populatedTourist.bookedTransportations); // Log after population

    // Loop through the transportations and close the bookings for past dates
    const currentDate = new Date(); // Get the current date

    const updatedTransportations = populatedTourist.bookedTransportations.map((transport) => {
      // Check if the transportation's date has passed
      const transportDate = new Date(transport.date); // Assuming transport.date is in a valid format

      // If the transportation's date has passed, close the booking
      if (transportDate < currentDate) {
        transport.isBookingOpen = false; // Close the booking
      }

      return transport;
    });

    // Return the updated transportations (now with booking statuses updated)
    res.status(200).json(updatedTransportations);
  } catch (error) {
    console.error("Error fetching booked transportations:", error);
    res.status(500).json({ error: error.message });
  }
};



const getTouristNationality = async (req, res) => {
  const { touristId } = req.params;

  // Ensure touristId is a valid MongoDB ObjectId
  // if (!mongoose.Types.ObjectId.isValid(touristId)) {
  //   return res.status(400).json({ error: "Invalid tourist ID format" });
  // }

  try {
    const tourist = await touristModel.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    res.status(200).json({ Nationality: tourist.Nationality });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const deleteAllTourist = async (req, res) => {
  try {
    await touristModel.deleteMany({});
    res.status(200).json({ message: "All tourist have been deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTourist,
  updateTourist,
  getTourist,
  getTouristById,
  deleteTourist,
  deleteAllTourist,
  bookTransportation,
  getBookedTransportations,
  getTouristNationality,
};

const touristModel = require("../models/Tourist.js");
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
  deleteAllTourist,
};

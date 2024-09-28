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
    const users = await touristModel.findOneAndUpdate(
      { UserName: UserName },
      {
        Email: Email,
        Password: Password,
        MobileNumber: MobileNumber,
        Nationality: Nationality,
        DateOfBirth: DateOfBirth,
        Job: Job,
      },
      { new: true }
    );
    res.status(200).json(users);
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

module.exports = { createTourist, updateTourist, getTourist };

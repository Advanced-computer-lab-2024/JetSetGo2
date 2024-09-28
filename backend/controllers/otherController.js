const otherModel = require("../models/Other.js");
const { default: mongoose } = require("mongoose");

const createOther = async (req, res) => {
  // create a other after sign up
  const { UserName, Email, Password } = req.body;
  try {
    const other = await otherModel.create({
      UserName,
      Email,
      Password,
    });
    res.status(200).json(other);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getOther = async (req, res) => {
  try {
    const other = await otherModel.find({});
    res.status(200).json(other);
  } catch (error) {
    res.status(400).json({ error: error.messege });
  }
};

module.exports = { createOther, getOther };

const Activity = require('../models/ActivityCRUD');
const Category = require('../models/CategoryCRUD');
const Advertiser = require('../models/AdverMODEL'); // Assuming this is the model for advertiser

// Create Activity
const createActivity = async (req, res) => {
  try {
    // Ensure the provided category ID is valid
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    // Ensure the provided advertiser ID is valid
    const advertiser = await Advertiser.findById(req.body.advertiser);
    if (!advertiser) {
      return res.status(400).json({ error: 'Invalid advertiser' });
    }

    const activityData = {
      ...req.body,
      category: req.body.category,
      advertiser: req.body.advertiser, // Add advertiser to the activity
    };

    const activity = await Activity.create(activityData);
    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Activities with Category and Advertiser Populated
const getActivity = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate('category', 'name')  // Populate the 'category' field with the 'name'
      .populate('advertiser', 'Name'); // Populate the 'advertiser' field with the 'name'

    res.status(200).json(activities);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Activity
const updateActivity = async (req, res) => {
  const { id } = req.params; // Get the activity ID from the request params
  const updateData = {};

  // Add fields to updateData if they exist in the request body
  if (req.body.date) updateData.date = req.body.date;
  if (req.body.time) updateData.time = req.body.time;
  if (req.body.location) updateData.location = req.body.location;
  if (req.body.price) updateData.price = req.body.price;

  if (req.body.category) {
    // Ensure the category ID is valid
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).json({ error: 'Invalid category' });
    }
    updateData.category = req.body.category; // Set category ID
  }

  if (req.body.advertiser) {
    // Ensure the advertiser ID is valid
    const advertiser = await Advertiser.findById(req.body.advertiser);
    if (!advertiser) {
      return res.status(400).json({ error: 'Invalid advertiser' });
    }
    updateData.advertiser = req.body.advertiser; // Set advertiser ID
  }

  if (req.body.tags) updateData.tags = req.body.tags;
  if (req.body.specialDiscount) updateData.specialDiscount = req.body.specialDiscount;
  if (req.body.isBookingOpen !== undefined) updateData.isBookingOpen = req.body.isBookingOpen;

  try {
    const updatedActivity = await Activity.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // Ensure validators run on updates
    )
      .populate('category', 'name') // Populate category field
      .populate('advertiser', 'Name'); // Populate advertiser field

    if (!updatedActivity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.status(200).json(updatedActivity); // Send updated activity as response
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Other methods remain unchanged
const deleteActivity = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedActivity = await Activity.findByIdAndDelete(id);
    if (!deletedActivity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteAllActivities = async (req, res) => {
  try {
    await Activity.deleteMany({});
    res.status(200).json({ message: 'All activities have been deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  createActivity,
  getActivity,
  updateActivity,
  deleteActivity,
  deleteAllActivities
  
};

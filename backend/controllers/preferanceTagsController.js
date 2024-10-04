const PreferenceTag = require('../models/preferanceTagsCRUD.js');

const createTag = async (req, res) => {
    const { name } = req.body;
  
    try {
      const newTag = await PreferenceTag.create({ name });
      res.status(201).json(newTag);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  const getTags = async (req, res) => {
    try {
      const tags = await PreferenceTag.find();
      res.status(200).json(tags);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  const updateTag = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
  
    try {
      const updatedTag = await PreferenceTag.findByIdAndUpdate(id, { name }, { new: true });
      if (!updatedTag) {
        return res.status(404).json({ message: 'Tag not found' });
      }
      res.status(200).json(updatedTag);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  const deleteTag = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedTag = await PreferenceTag.findByIdAndDelete(id);
      if (!deletedTag) {
        return res.status(404).json({ message: 'Tag not found' });
      }
      res.status(200).json({ message: 'Tag deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  module.exports = {
    createTag,
    getTags,
    updateTag,
    deleteTag,
  };
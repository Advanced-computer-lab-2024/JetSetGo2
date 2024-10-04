const express = require('express');
const { createTag, getTags, updateTag, deleteTag } = require('../controllers/preferanceTagsController');

const router = express.Router();

router.post("/createtag", createTag);
router.get("/readtag", getTags);
router.put("/updateTagId/:id", updateTag);
router.delete("/deletetag/:id", deleteTag);

module.exports = router;
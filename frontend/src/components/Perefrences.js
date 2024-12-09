import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PreferenceTagsPage = () => {
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const touristId = localStorage.getItem("userId");

  useEffect(() => {
    // Fetch all preference tags from the backend
    const fetchTags = async () => {
      try {
        const response = await axios.get("http://localhost:8000/prefTags/readtag");
        setTags(response.data);
      } catch (error) {
        console.error("Error fetching preference tags:", error);
      }
    };

    fetchTags();
  }, []);

  const handleTagSelection = (tagId) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((tag) => tag !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleSavePreferences = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/home/tourist/addPreferenceTags/${touristId}`,
        { tags: selectedTags }
      );
      alert("Preferences saved successfully!");
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save preferences.");
    }
  };

  return (
    <div>
      <h1>Select Your Preference Tags</h1>
      <div>
        {tags.map((tag) => (
          <div key={tag._id}>
            <input
              type="checkbox"
              id={tag._id}
              onChange={() => handleTagSelection(tag._id)}
            />
            <label htmlFor={tag._id}>{tag.name}</label>
          </div>
        ))}
      </div>
      <button onClick={handleSavePreferences}>Save Preferences</button>
    </div>
  );
};

export default PreferenceTagsPage;
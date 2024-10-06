import React, { useState, useEffect } from "react";
import {
  getActivity,
  getCategories,
  getTags,
} from "../../services/ActivityService"; // Ensure to import the necessary services

const predefinedLocations = [
  {
    name: "Cairo, Egypt",
    coordinates: "31.2357,30.0444,31.2557,30.0644",
  },
  {
    name: "Giza Pyramids, Egypt",
    coordinates: "31.1313,29.9765,31.1513,29.9965",
  },
  {
    name: "Alexandria, Egypt",
    coordinates: "29.9097,31.2156,29.9297,31.2356",
  },
  {
    name: "German University in Cairo, Egypt",
    coordinates: "31.4486,29.9869,31.4686,30.0069", // Sample bounding box
  },
  {
    name: "Cairo Festival City, Egypt",
    coordinates: "31.4015,30.0254,31.4215,30.0454", // Sample bounding box
  },
  // Add more locations as needed
];

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]); // State to hold categories
  const [tags, setTags] = useState([]);
  const [sortOrder, setSortOrder] = useState("none"); // State for sorting order

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    location: "",
    price: "",
    category: "",
    tags: "",
    specialDiscount: "",
    isBookingOpen: true,
  });
  const [editData, setEditData] = useState(null);

  // Fetch activities, categories, and tags when the component mounts
  useEffect(() => {
    fetchActivities();
    fetchCategories();
    fetchTags();
  }, []);

  const fetchActivities = async () => {
    try {
      const data = await getActivity();
      const upcomingActivities = data.filter((activity) => {
        const activityDate = new Date(activity.date); // Parse the activity date
        const currentDate = new Date(); // Get the current date
        return activityDate >= currentDate; // Compare dates
      });
      setActivities(upcomingActivities);
    } catch (error) {
      console.error("Error fetching activities", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const fetchTags = async () => {
    try {
      const data = await getTags();
      setTags(data);
    } catch (error) {
      console.error("Error fetching tags", error);
    }
  };

  const handleSortOrderChange = (event) => {
    const selectedSortOrder = event.target.value;
    setSortOrder(selectedSortOrder);

    let sortedActivities = [...activities];
    if (selectedSortOrder === "lowToHigh") {
      sortedActivities = sortedActivities.sort((a, b) => a.price - b.price);
    } else if (selectedSortOrder === "highToLow") {
      sortedActivities = sortedActivities.sort((a, b) => b.price - a.price);
    }

    setActivities(sortedActivities); // Update the state with sorted activities
  };

  const generateMapSrc = (coordinates) => {
    const [long1, lat1, long2, lat2] = coordinates.split(",");
    return `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates}&layer=mapnik&marker=${lat1},${long1}`;
  };

  return (
    <div id="activities">
      <section className="activity-list">
        <h2>Activity List</h2>
        {activities.length > 0 ? (
          <ul>
            {activities.map((activity) => {
              const locationData = predefinedLocations.find(
                (location) => location.name === activity.location
              );
              const mapSrc = locationData
                ? generateMapSrc(locationData.coordinates)
                : null;

              return (
                <li key={activity._id} className="activity-item">
                  <h3>{activity.category ? activity.category.name : "No Category"}</h3>
                  <h3>{activity.advertiser ? activity.advertiser.Name : "No Advertiser"}</h3>
                  <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
                  <p>Time: {new Date(activity.time).toLocaleTimeString()}</p>
                  <p>Location: {activity.location}</p>
                  <p>Price: ${activity.price}</p>
                  <p>Tags: {activity.tags ? activity.tags.name : "No Tags"}</p>
                  <p>Special Discount: {activity.specialDiscount}%</p>
                  <p>Booking Open: {activity.isBookingOpen ? "Yes" : "No"}</p>
                  {mapSrc && (
                    <iframe
                      title={`Map for ${activity.location}`}
                      src={mapSrc}
                      width="300"
                      height="200"
                      style={{ border: "none" }}
                    ></iframe>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No activities available.</p>
        )}
      </section>
    </div>
  );
};

export default Activities;

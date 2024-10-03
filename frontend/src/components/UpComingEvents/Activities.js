// src/components/Activities.js
import React, { useState, useEffect } from 'react';

const Activities = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Fetch the upcoming activities from your MongoDB backend
    fetch('/api/activities') // Adjust the endpoint according to your backend
      .then(response => response.json())
      .then(data => setActivities(data));
  }, []);

  return (
    <div id="activities">
      <h2>Upcoming Activities</h2>
      <ul>
        {activities.map(activity => (
          <li key={activity._id}>
            {activity.name} - {new Date(activity.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Activities;

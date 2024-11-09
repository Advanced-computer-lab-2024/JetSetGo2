import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMuseumById } from '../services/MuseumService'; // Assuming you have this service method

const MuseumDetails = () => {
  const { id } = useParams(); // Retrieve the museum ID from the URL
  const [museum, setMuseum] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMuseum = async () => {
      try {
        const data = await getMuseumById(id); // Fetch museum data by ID
        setMuseum(data);
      } catch (err) {
        setError('Failed to load museum details. Please try again later.');
      }
    };
    fetchMuseum();
  }, [id]);

  if (error) return <p>{error}</p>;

  return museum ? (
    <div style={styles.container}>
      <h2>{museum.description}</h2>
      <img src={museum.pictures} alt={`Image of ${museum.description}`} style={styles.image} />
      <p>Location: {museum.location}</p>
      <p>Opening Hours: {museum.openingHours}</p>
      <p>Foreigner Ticket Price: ${museum.foreignerTicketPrice}</p>
      <p>Native Ticket Price: ${museum.nativeTicketPrice}</p>
      <p>Student Ticket Price: ${museum.studentTicketPrice}</p>
      <p>Tourism Governor Tag: {museum.tourismGovernerTags?.type || 'N/A'}</p>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: "'Arial', sans-serif",
  },
  image: {
    width: '100%',
    maxHeight: '300px',
    objectFit: 'cover',
  },
};

export default MuseumDetails;

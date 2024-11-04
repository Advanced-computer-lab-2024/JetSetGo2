import Amadeus from 'amadeus';
import fetch from 'node-fetch'; // Ensure to install node-fetch if not already installed

// Initialize Amadeus with your credentials
const amadeus = new Amadeus({
  clientId: 'LYT4JF7n7vkYqq6pYNDUMbOBDFSA7ieh',
  clientSecret: 'oGEoeufzY0Miwu4n'
});

// Function to get the Bearer token
async function getBearerToken() {
  try {
    const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: 'LYT4JF7n7vkYqq6pYNDUMbOBDFSA7ieh',
        client_secret: 'oGEoeufzY0Miwu4n'
      })
    });

    const data = await response.json();
    if (data.access_token) {
      return data.access_token;
    } else {
      throw new Error('Failed to retrieve access token');
    }
  } catch (error) {
    console.error('Error fetching Bearer token:', error);
    throw error;
  }
}

// Function to search for flights
async function searchFlights() {
  try {
    const token = await getBearerToken();

    const response = await fetch(
      'https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=CAI&destinationLocationCode=LHR&departureDate=2024-11-15&adults=1',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = await response.json();

    if (data.errors) {
      console.error('Error searching for flights:', data.errors);
    } else {
      console.log('Flight search results:');
      data.data.forEach((offer, index) => {
        console.log(`\nFlight Offer #${index + 1}:`);
        console.log(`ID: ${offer.id}`);
        console.log(`Price: ${offer.price.total} ${offer.price.currency}`);
        console.log(`Number of Bookable Seats: ${offer.numberOfBookableSeats}`);
        offer.itineraries.forEach((itinerary, i) => {
          console.log(`\n  Itinerary ${i + 1}:`);
          itinerary.segments.forEach((segment, j) => {
            console.log(`    Segment ${j + 1}:`);
            console.log(`      Departure: ${segment.departure.iataCode} at ${segment.departure.at}`);
            console.log(`      Arrival: ${segment.arrival.iataCode} at ${segment.arrival.at}`);
            console.log(`      Carrier: ${segment.carrierCode} Flight Number: ${segment.number}`);
          });
        });
        console.log(`\nPricing Options: Included Checked Bags Only - ${offer.pricingOptions.includedCheckedBagsOnly}`);
        console.log(`Validating Airline Codes: ${offer.validatingAirlineCodes.join(', ')}`);
      });
    }
  } catch (error) {
    console.error('Error searching for flights:', error);
  }
}

// Function to book a flight
async function bookFlight(flightOfferId) {
  try {
    const token = await getBearerToken();

    const response = await fetch(`https://test.api.amadeus.com/v2/booking/flight-orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          type: 'flight-order',
          flightOfferIds: [flightOfferId],
          traveler: [
            {
              id: '1',
              name: {
                first: 'John',
                last: 'Doe'
              },
              contact: {
                email: 'john.doe@example.com',
                phones: [
                  {
                    countryCallingCode: '1',
                    number: '123456789'
                  }
                ]
              }
            }
          ]
        }
      })
    });

    const data = await response.json();

    if (data.errors) {
      console.error('Error booking flight:', data.errors);
    } else {
      console.log('Flight booked successfully:', data);
    }
  } catch (error) {
    console.error('Error during booking:', error);
  }
}

// Call the function to test flight search
searchFlights().then(() => {
  // You can book a flight after searching
  // Replace 'YOUR_FLIGHT_OFFER_ID' with the actual ID of the flight you want to book
  bookFlight('70'); // Example flight offer ID
});

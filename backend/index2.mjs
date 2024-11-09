import Amadeus from 'amadeus';
import fetch from 'node-fetch'; // Ensure to install node-fetch if not already installed

// Initialize Amadeus with your credentials
const amadeus = new Amadeus({
  clientId: 'f44FIEE3isodpiA97rUeUAo8ZThTbgaC',
  clientSecret: 'xDYCFbRB2MhmyHOG'
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
        client_id: 'f44FIEE3isodpiA97rUeUAo8ZThTbgaC',
        client_secret: 'xDYCFbRB2MhmyHOG'
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

// Function to get hotels by city code
async function getHotelsByCity(cityCode) {
  try {
    const token = await getBearerToken();

    const response = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}`,
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
      console.error('Error fetching hotels:', data.errors);
    } else {
      console.log('Hotels in city:', data.data);
    }
  } catch (error) {
    console.error('Error fetching hotels by city:', error);
  }
}

// Function to get hotel offers by hotel ID
async function getHotelOffers(hotelId) {
  try {
    const token = await getBearerToken();

    const response = await fetch(
      `https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelId=${hotelId}`,
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
      console.error('Error fetching hotel offers:', data.errors);
    } else {
      console.log('Hotel offers:', data.data);
    }
  } catch (error) {
    console.error('Error fetching hotel offers:', error);
  }
}

// Function to book a hotel offer
async function bookHotel(offerId) {
  try {
    const token = await getBearerToken();

    const response = await fetch(`https://test.api.amadeus.com/v2/booking/hotel-orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          offerId: offerId,
          guests: [
            {
              name: {
                title: 'MR',
                firstName: 'John',
                lastName: 'Doe'
              },
              contact: {
                phone: '1234567890',
                email: 'john.doe@example.com'
              }
            }
          ],
          payments: [
            {
              method: 'creditCard',
              card: {
                vendorCode: 'VI',
                cardNumber: '4111111111111111',
                expiryDate: '2024-12'
              }
            }
          ]
        }
      })
    });

    const data = await response.json();

    if (data.errors) {
      console.error('Error booking hotel:', data.errors);
    } else {
      console.log('Hotel booked successfully:', data);
    }
  } catch (error) {
    console.error('Error during hotel booking:', error);
  }
}

// Example usage
// Fetch hotels by city code
getHotelsByCity('NYC').then(() => {
  // Fetch offers for a specific hotel after retrieving hotels
  getHotelOffers('HOTEL_ID').then(() => {
    // Book a specific offer
    bookHotel('OFFER_ID');
  });
});

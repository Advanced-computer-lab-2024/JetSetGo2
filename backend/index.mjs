import fetch from 'node-fetch';
import axios from 'axios';

async function getAccessToken(clientId, clientSecret) {
    const url = 'https://test.api.amadeus.com/v1/security/oauth2/token';
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };
    const body = `grant_type=client_credentials&client_id=${'3DHXX1uuxJOMekdpB3StiavXPqgH2AXs'}&client_secret=${'iInm210Sk4QrKx8E'}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body,
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.access_token; // Return the access token
    } catch (error) {
        console.error('Error fetching access token:', error);
    }
}

async function getFlightDestinations(origin, maxPrice, accessToken) {
    const url = `https://test.api.amadeus.com/v1/shopping/flight-destinations?origin=${origin}&maxPrice=${maxPrice}`;
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
    };

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.data; // Return the list of flight destinations
    } catch (error) {
        console.error('Error fetching flight destinations:', error);
    }
}
async function getFlightOffers(origin, destination, departureDate, returnDate) {
    const url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&returnDate=${returnDate}&adults=1&nonStop=false&maxPrice=200&currency=EUR`;
    
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${'YOUR_ACCESS_TOKEN'}`
            }
        });
        return response.data.data; // Assuming the flight offers are in response.data.data
    } catch (error) {
        console.error("Error fetching flight offers:", error.response?.data || error.message);
        throw error; // Re-throw the error to handle it in the main function
    }
}

async function bookFlight(flightOffer, accessToken) {
    const url = `https://test.api.amadeus.com/v2/flight-orders`;
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    };
    const body = JSON.stringify({
        data: {
            type: 'flight-order',
            flightOffers: [flightOffer],
            passengers: [
                {
                    id: '1',
                    firstName: 'John',
                    lastName: 'Doe',
                    dateOfBirth: '1980-01-01',
                    nationality: 'US',
                    email: 'john.doe@example.com',
                    phone: {
                        countryCode: '1',
                        number: '1234567890'
                    }
                }
            ],
            payment: {
                method: 'creditCard',
                card: {
                    type: 'visa',
                    number: '4111111111111111',
                    expirationMonth: '12',
                    expirationYear: '2025',
                    securityCode: '123'
                }
            }
        }
    });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body,
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data; // Return the booking confirmation
    } catch (error) {
        console.error('Error booking flight:', error);
    }
}


async function main() {
    const clientId = '3DHXX1uuxJOMekdpB3StiavXPqgH2AXs'; // Replace with your API Key
    const clientSecret = 'iInm210Sk4QrKx8E'; // Replace with your API Secret
    const origin = 'PAR'; // Example origin
    const maxPrice = 200; // Example max price

    const accessToken = await getAccessToken(clientId, clientSecret);
 
    if (accessToken) {
        const destinations = await getFlightDestinations(origin, maxPrice, accessToken);
        console.log('Flight Destinations:', destinations);

        // Choose a flight offer to view details
        const chosenDestination = destinations[0]; // Example: selecting the first destination
        const flightOffers = await getFlightOffers(origin, chosenDestination.destination, chosenDestination.departureDate, chosenDestination.returnDate, accessToken);
        
        console.log('Flight Offers:', flightOffers);

        // Choose a flight offer to book
        const chosenOffer = flightOffers[0]; // Example: selecting the first offer
        const bookingConfirmation = await bookFlight(chosenOffer, accessToken);
        
        console.log('Booking Confirmation:', bookingConfirmation);
    }
}

main();


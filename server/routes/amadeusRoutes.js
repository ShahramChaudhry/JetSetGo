
import express from 'express';
import fetch from 'node-fetch';
import {
  AMADEUS_CLIENT_ID,
  AMADEUS_CLIENT_SECRET,
} from '../config.mjs';

const router = express.Router();

router.get('/destinations', async (req, res) => {
  try {
    const departure = req.query.origin;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    if (!departure || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required parameters (origin, startDate, endDate)' });
    }

    // ✅ Get Amadeus access token
    const tokenRes = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: AMADEUS_CLIENT_ID,
        client_secret: AMADEUS_CLIENT_SECRET,
      }),
    });

    const tokenData = await tokenRes.json();
    const token = tokenData.access_token;

    if (!token) {
      return res.status(500).json({ error: 'Failed to retrieve Amadeus token', details: tokenData });
    }

    // ✅ Call Amadeus API
    const params = new URLSearchParams({
      origin: departure,
      maxPrice: '300',
      departureDate: `${startDate},${endDate}`,
    });

    const flightRes = await fetch(
      `https://test.api.amadeus.com/v1/shopping/flight-destinations?${params.toString()}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const flightData = await flightRes.json();

    if (!flightData.data) {
      return res.status(500).json({ error: 'No destination data received', details: flightData });
    }

    // ✅ Filter based on returnDate
    const filtered = flightData.data.filter((d) => {
      if (!d.returnDate) return true; // one-way flight or missing
      return new Date(d.returnDate) <= new Date(endDate);
    });

    res.json({ data: filtered });
  } catch (error) {
    console.error('❌ Amadeus API error:', error);
    res.status(500).json({ error: 'Internal server error', details: error });
  }
});

router.get('/offers', async (req, res) => {
  const { origin, destination, departureDate } = req.query;

  if (!origin || !destination || !departureDate) {
    return res.status(400).json({ error: 'Missing query parameters' });
  }

  try {
    // Step 1: Get token
    const tokenRes = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: AMADEUS_CLIENT_ID,
        client_secret: AMADEUS_CLIENT_SECRET,
      }),
    });
    const tokenData = await tokenRes.json();
    const token = tokenData.access_token;

    // Step 2: Fetch flight offers
    const offerRes = await fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=1`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const offerData = await offerRes.json();
    res.json(offerData);
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ error: 'Failed to retrieve flight offers' });
  }
});


router.post('/price', async (req, res) => {
  try {
    const { flightOffer } = req.body;

    if (!flightOffer) {
      console.error('❌ No flightOffer in request body');
      return res.status(400).json({ error: 'Missing flightOffer in request body' });
    }

    // Step 1: Token
    const tokenRes = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: AMADEUS_CLIENT_ID,
        client_secret: AMADEUS_CLIENT_SECRET,
      }),
    });

    const tokenData = await tokenRes.json();
    const token = tokenData.access_token;

    if (!token) {
      console.error('❌ Token error:', tokenData);
      return res.status(500).json({ error: 'Failed to get access token', details: tokenData });
    }

    // Step 2: Pricing
    const priceRes = await fetch('https://test.api.amadeus.com/v1/shopping/flight-offers/pricing', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-HTTP-Method-Override': 'GET',
      },
      body: JSON.stringify({
        data: {
          type: 'flight-offers-pricing',
          flightOffers: [flightOffer],
        },
      }),
    });

    const priceData = await priceRes.json();

    if (!priceRes.ok) {
      console.error('❌ Amadeus pricing failed:', priceData);
      return res.status(500).json({ error: 'Failed to confirm flight price', details: priceData });
    }

    res.json(priceData);
  } catch (error) {
    console.error('❌ Unexpected server error in /price:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});
export default router;
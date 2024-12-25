import express from 'express';
import Itinerary from '../models/Itinerary.js';
import { ensureAuthenticated } from '../auth.mjs';
import axios from 'axios';
import User from '../models/User.js';

const router = express.Router();

router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    }

    const userId = req.user._id;
    console.log(`Fetching itineraries for user: ${userId}`);

    const itineraries = await Itinerary.find({ user: userId });
    console.log(`Itineraries found: ${itineraries.length}`);

    const enhancedItineraries = await Promise.all(
      itineraries.map(async (itinerary) => {
        console.log(`Processing itinerary ID: ${itinerary._id}, Title: ${itinerary.title}`);

        const visaRequirements = await Promise.all(
          itinerary.destinations.map(async (destination) => {
            const visaApiUrl = `https://rough-sun-2523.fly.dev/visa/${req.user.nationality}/${destination.country}`;
            console.log(`Fetching visa info for destination: ${destination.city}, ${destination.country}`);
            console.log(`Visa API URL: ${visaApiUrl}`);

            try {
              const response = await axios.get(visaApiUrl);
              console.log(`Visa API response for ${destination.country}:`, response.data);
              return { ...destination, visa_info: response.data };
            } catch (error) {
              console.error(`Error fetching visa info for ${destination.country}:`, error.message);
              return { ...destination, visa_info: { error: 'Unable to fetch visa requirements' } };
            }
          })
        );

        console.log(`Completed processing for itinerary ID: ${itinerary._id}`);
        return { ...itinerary.toObject(), visaRequirements };
      })
    );

    console.log('All itineraries processed successfully. Sending response to client.');
    res.status(200).json(enhancedItineraries);
  } catch (error) {
    console.error('Error in /api/itineraries:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const { start_date, end_date, destinations } = req.body;
    const userId = req.user._id;

    const visaRequirements = await Promise.all(
      destinations.map(async (destination) => {
        const visaApiUrl = `https://rough-sun-2523.fly.dev/visa/${req.user.nationality}/${destination.country}`;
        try {
          const response = await axios.get(visaApiUrl);
          return { ...destination, visa_info: response.data };
        } catch (error) {
          return { ...destination, visa_info: { error: 'Unable to fetch visa requirements' } };
        }
      })
    );

    const newItinerary = new Itinerary({
      title: 'New Itinerary',
      user: userId,
      start_date,
      end_date,
      destinations: visaRequirements,
    });

    const savedItinerary = await newItinerary.save();
    res.status(201).json({ message: 'Itinerary created successfully', itinerary: savedItinerary });
  } catch (error) {
    console.error('Error creating itinerary:', error.message);
    res.status(500).json({ message: 'Error creating itinerary' });
  }
});
export default router;

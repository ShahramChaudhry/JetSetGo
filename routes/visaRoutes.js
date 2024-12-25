import express from 'express';
import axios from 'axios';
import { ensureAuthenticated } from '../auth.mjs';

const router = express.Router();


router.post('/fetch-visa-requirements', ensureAuthenticated, async (req, res) => {
  const { destinations } = req.body;
  const visaRequirements = [];

  try {

    const userNationality = req.user.nationality; 
    console.log('User nationality:', userNationality);

    if (!userNationality) {
      return res.status(400).json({ message: 'User nationality is not set' });
    }

    for (const destination of destinations) {
      try {
        const visaApiUrl = `https://rough-sun-2523.fly.dev/visa/${userNationality}/${destination.country}`;
        console.log(`Making API call to: ${visaApiUrl}`);
        const response = await axios.get(visaApiUrl);

        visaRequirements.push({
          city: destination.city,
          country: destination.country,
          visa_info: response.data,
        });

        console.log('Visa requirement added:', {
          city: destination.city,
          country: destination.country,
          visa_info: response.data,
        });
      } catch (apiError) {
        console.error(
          `Error fetching visa requirements for ${destination.city}, ${destination.country}:`,
          apiError.message
        );
        visaRequirements.push({
          city: destination.city,
          country: destination.country,
          visa_info: { error: 'Unable to fetch visa requirements' },
        });
      }
    }

    res.status(200).json(visaRequirements);
  } catch (error) {
    console.error('Error fetching visa requirements:', error.message);
    res.status(500).json({ message: 'Error fetching visa requirements' });
  }
});

export default router;

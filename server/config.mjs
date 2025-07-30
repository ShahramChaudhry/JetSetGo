
import { config } from 'dotenv';

config(); 
export const MONGODB_URI = process.env.MONGODB_URI;
export const SESSION_SECRET = process.env.SESSION_SECRET;
export const PORT = process.env.PORT || 3000;
export const AMADEUS_CLIENT_ID = process.env.AMADEUS_CLIENT_ID;
export const AMADEUS_CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET;
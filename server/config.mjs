
import { config } from 'dotenv';

config(); 
export const MONGODB_URI = process.env.MONGODB_URI;
export const SESSION_SECRET = process.env.SESSION_SECRET;
export const PORT = process.env.PORT || 3000;

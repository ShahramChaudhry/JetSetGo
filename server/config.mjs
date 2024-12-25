
import { config } from 'dotenv';

config(); 
export const DSN = process.env.DSN;
export const SESSION_SECRET = process.env.SESSION_SECRET;
export const PORT = process.env.PORT ?? 3000;

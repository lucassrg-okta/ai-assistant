import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' }); // ✅ Load env immediately

console.log('✅ ENV Loaded:', {
  FGA_API_URL: process.env.FGA_API_URL,
  FGA_STORE_ID: process.env.FGA_STORE_ID,
  FGA_CLIENT_ID: process.env.FGA_CLIENT_ID,
  FGA_CLIENT_SECRET: process.env.FGA_CLIENT_SECRET,
});

import { fga } from '@/lib/fga/client'; // Load after dotenv
import { readDocuments } from '@/lib/rag/docs';

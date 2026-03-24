import dotenv from 'dotenv';
import db from './config/db.js';

// Load environment variables before importing app
dotenv.config();

import app from './app.js';

const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 API Server running on port ${PORT}`);
});
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToWhatsApp } from './whatsapp';
import router from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', router);

// Health check
app.get('/', (req, res) => {
    res.send('Baileys WhatsApp Service is Running! 🚀');
});

// Start Server
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);

    // Start WhatsApp connection
    await connectToWhatsApp();
});

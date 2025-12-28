import { Router } from 'express';
import { sendMessage, qrCode, connectionStatus, logoutWhatsApp, connectToWhatsApp } from './whatsapp';
import QRCode from 'qrcode';

const router = Router();

// Middleware to check API key
const checkApiKey = (req: any, res: any, next: any) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

// Send Message Endpoint
router.post('/send', checkApiKey, async (req, res) => {
    try {
        const { phone, message } = req.body;

        if (!phone || !message) {
            return res.status(400).json({ error: 'Phone and message are required' });
        }

        const result = await sendMessage(phone, message);
        res.json(result);
    } catch (error: any) {
        console.error('Send message error:', error);
        res.status(500).json({ error: error.message || 'Failed to send message' });
    }
});

// Status Endpoint
router.get('/status', checkApiKey, async (req, res) => {
    res.json({
        status: connectionStatus,
        hasQr: !!qrCode
    });
});

// QR Code Image Endpoint
router.get('/qr', checkApiKey, async (req, res) => {
    if (connectionStatus === 'connected') {
        return res.status(400).json({ error: 'Already connected', status: 'connected' });
    }

    if (!qrCode) {
        return res.status(404).json({ error: 'QR Code not generated yet', status: connectionStatus });
    }

    try {
        const qrImage = await QRCode.toDataURL(qrCode);
        res.json({ qrImage, status: connectionStatus });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate QR image' });
    }
});

// Logout Endpoint
router.post('/logout', checkApiKey, async (req, res) => {
    try {
        const result = await logoutWhatsApp();
        res.json(result);
    } catch (error: any) {
        console.error('Logout error:', error);
        res.status(500).json({ error: error.message || 'Failed to logout' });
    }
});

// Reconnect Endpoint - triggers new QR generation
router.post('/reconnect', checkApiKey, async (req, res) => {
    try {
        console.log('Reconnect requested...');
        await connectToWhatsApp();
        res.json({ success: true, message: 'Reconnection initiated, check /qr for new QR code' });
    } catch (error: any) {
        console.error('Reconnect error:', error);
        res.status(500).json({ error: error.message || 'Failed to reconnect' });
    }
});

export default router;

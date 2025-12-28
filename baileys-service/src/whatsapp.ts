import makeWASocket, {
    DisconnectReason,
    useMultiFileAuthState,
    ConnectionState,
    Browsers,
    fetchLatestBaileysVersion
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import fs from 'fs';

// Store the socket connection globally
export let sock: any = null;
export let qrCode: string | null = null;
export let connectionStatus: string = 'disconnected';
let isConnecting = false;

export async function connectToWhatsApp() {
    if (isConnecting) {
        console.log('Already attempting to connect, skipping...');
        return;
    }

    try {
        isConnecting = true;

        // Close existing socket if any
        if (sock) {
            console.log('Closing existing socket...');
            try {
                sock.ev.removeAllListeners('connection.update');
                sock.ev.removeAllListeners('creds.update');
                sock.end(undefined);
            } catch (e) {
                console.error('Error closing socket:', e);
            }
            sock = null;
        }

        const { version, isLatest } = await fetchLatestBaileysVersion();
        console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`);

        // Auth folder path - MUST match the Docker volume path or local path
        const authPath = process.env.AUTH_PATH || './baileys_auth_new';

        if (!fs.existsSync(authPath)) {
            fs.mkdirSync(authPath, { recursive: true });
        }

        const { state, saveCreds } = await useMultiFileAuthState(authPath);

        connectionStatus = 'initializing';

        sock = makeWASocket({
            version,
            logger: pino({ level: 'silent' }) as any,
            auth: state,
            // Using Ubuntu/Chrome signature reduces 405 errors
            browser: Browsers.ubuntu('Chrome'),
            // Fix for some connection issues
            connectTimeoutMs: 60000,
            defaultQueryTimeoutMs: 60000,
            keepAliveIntervalMs: 10000,
            emitOwnEvents: false,
            retryRequestDelayMs: 250
        });

        sock.ev.on('connection.update', (update: Partial<ConnectionState>) => {
            const { connection, lastDisconnect, qr } = update;

            if (qr) {
                qrCode = qr;
                connectionStatus = 'scanning';
                console.log('NEW QR CODE GENERATED');
            }

            if (connection === 'close') {
                const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
                const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

                console.log('Connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect);

                qrCode = null;
                connectionStatus = 'disconnected';
                isConnecting = false;

                if (shouldReconnect) {
                    setTimeout(() => connectToWhatsApp(), 5000);
                }
            } else if (connection === 'open') {
                console.log('Opened connection');
                qrCode = null;
                connectionStatus = 'connected';
                isConnecting = false;
            }
        });

        sock.ev.on('creds.update', saveCreds);
    } catch (error) {
        console.error('Failed to connect to WhatsApp:', error);
        isConnecting = false;
        connectionStatus = 'error';
    }
}

export async function sendMessage(phone: string, text: string) {
    if (!sock || connectionStatus !== 'connected') {
        throw new Error('WhatsApp service not connected');
    }

    // Format phone number: remove +, spaces, ensure defaults
    let cleanPhone = phone.replace(/[^0-9]/g, '');

    // TR specific correction
    if (cleanPhone.startsWith('90') && cleanPhone.length === 12) {
        // already correct
    } else if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
        cleanPhone = '9' + cleanPhone;
    } else if (cleanPhone.length === 10) {
        cleanPhone = '90' + cleanPhone;
    }

    const jid = `${cleanPhone}@s.whatsapp.net`;

    await sock.sendMessage(jid, { text });
    return { success: true, jid };
}

export async function logoutWhatsApp() {
    try {
        qrCode = null;
        connectionStatus = 'disconnected';

        if (sock) {
            try {
                await sock.logout();
            } catch (e) {
                console.error('Error during socket logout:', e);
            }
            sock = null;
        }

        // Delete auth folder to completely reset
        const authPath = process.env.AUTH_PATH || './baileys_auth_new';
        if (fs.existsSync(authPath)) {
            console.log('Removing auth folder:', authPath);
            fs.rmSync(authPath, { recursive: true, force: true });
        }

        // Reconnect to get new QR
        setTimeout(() => {
            connectToWhatsApp();
        }, 3000);

        return { success: true, message: 'Logged out successfully' };
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
}

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

export async function connectToWhatsApp() {
    try {
        const { version, isLatest } = await fetchLatestBaileysVersion();
        console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`);

        // Auth folder path - MUST match the Docker volume path or local path
        const authPath = process.env.AUTH_PATH || './baileys_auth_new';

        if (!fs.existsSync(authPath)) {
            fs.mkdirSync(authPath, { recursive: true });
        }

        const { state, saveCreds } = await useMultiFileAuthState(authPath);

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
                const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
                console.log('Connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect);
                qrCode = null;
                connectionStatus = 'disconnected';

                if (shouldReconnect) {
                    connectToWhatsApp();
                }
            } else if (connection === 'open') {
                console.log('Opened connection');
                qrCode = null;
                connectionStatus = 'connected';
            }
        });

        sock.ev.on('creds.update', saveCreds);
    } catch (error) {
        console.error('Failed to connect to WhatsApp:', error);
    }
}

export async function sendMessage(phone: string, text: string) {
    if (!sock) throw new Error('WhatsApp service not connected');

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
    if (!sock) throw new Error('WhatsApp service not connected');

    try {
        await sock.logout();
        sock = null;
        qrCode = null;
        connectionStatus = 'disconnected';

        // Delete auth folder to completely reset
        const authPath = process.env.AUTH_PATH || './baileys_auth_new';
        if (fs.existsSync(authPath)) {
            fs.rmSync(authPath, { recursive: true, force: true });
        }

        // Reconnect to get new QR
        setTimeout(() => {
            connectToWhatsApp();
        }, 2000);

        return { success: true, message: 'Logged out successfully' };
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
}

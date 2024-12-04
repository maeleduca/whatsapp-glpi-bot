const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { setupBot } = require('./bot');
const { setupWebhooks } = require('./webhooks');
const { logger } = require('./utils/logger');
require('dotenv').config();

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox']
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    logger.info('QR Code generated. Scan with WhatsApp to start the session.');
});

client.on('ready', () => {
    logger.info('WhatsApp client is ready!');
    setupBot(client);
    setupWebhooks();
});

client.on('authenticated', () => {
    logger.info('WhatsApp client authenticated');
});

client.initialize();
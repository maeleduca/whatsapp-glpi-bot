const express = require('express');
const { handleTicketUpdate } = require('./handlers/ticketUpdateHandler');
const { logger } = require('../utils/logger');

const app = express();
app.use(express.json());

function setupWebhooks() {
    app.post('/webhook/ticket-update', async (req, res) => {
        try {
            await handleTicketUpdate(req.body);
            res.status(200).send('OK');
        } catch (error) {
            logger.error('Error handling ticket update webhook:', error);
            res.status(500).send('Error processing webhook');
        }
    });

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        logger.info(`Webhook server listening on port ${port}`);
    });
}

module.exports = { setupWebhooks };
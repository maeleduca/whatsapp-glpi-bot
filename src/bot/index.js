const { NlpManager } = require('node-nlp');
const { handleTicketCreation } = require('./handlers/ticketHandler');
const { handleAuthentication } = require('./handlers/authHandler');
const { handleUserUpdate } = require('./handlers/userHandler');
const { logger } = require('../utils/logger');

const nlp = new NlpManager({ languages: [process.env.NLP_LANGUAGE || 'pt'] });

async function setupBot(client) {
    await trainNLP();

    client.on('message', async msg => {
        try {
            const chat = await msg.getChat();
            const contact = await msg.getContact();
            
            // Process message with NLP
            const result = await nlp.process(msg.body);
            
            switch(result.intent) {
                case 'create_ticket':
                    await handleTicketCreation(client, msg, contact);
                    break;
                case 'authenticate':
                    await handleAuthentication(client, msg, contact);
                    break;
                case 'update_contact':
                    await handleUserUpdate(client, msg, contact);
                    break;
                default:
                    await chat.sendMessage('Desculpe, não entendi. Como posso ajudar você com o suporte?');
            }
        } catch (error) {
            logger.error('Error processing message:', error);
            await msg.reply('Desculpe, ocorreu um erro ao processar sua mensagem.');
        }
    });
}

async function trainNLP() {
    // Add training data for the NLP
    nlp.addDocument('pt', 'abrir chamado', 'create_ticket');
    nlp.addDocument('pt', 'novo ticket', 'create_ticket');
    nlp.addDocument('pt', 'preciso de suporte', 'create_ticket');
    nlp.addDocument('pt', 'problema técnico', 'create_ticket');
    
    nlp.addDocument('pt', 'fazer login', 'authenticate');
    nlp.addDocument('pt', 'autenticar', 'authenticate');
    
    nlp.addDocument('pt', 'atualizar contato', 'update_contact');
    nlp.addDocument('pt', 'atualizar número', 'update_contact');
    
    await nlp.train();
}

module.exports = { setupBot };
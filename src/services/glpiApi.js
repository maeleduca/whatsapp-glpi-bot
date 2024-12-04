const axios = require('axios');
const { logger } = require('../utils/logger');

class GLPIApi {
    constructor() {
        this.baseURL = process.env.GLPI_URL;
        this.appToken = process.env.GLPI_APP_TOKEN;
        this.sessionToken = null;
    }

    async initSession(userToken) {
        try {
            const response = await axios.post(`${this.baseURL}/initSession`, null, {
                headers: {
                    'Authorization': `user_token ${userToken}`,
                    'App-Token': this.appToken
                }
            });
            this.sessionToken = response.data.session_token;
            return this.sessionToken;
        } catch (error) {
            logger.error('Error initializing GLPI session:', error);
            throw new Error('Failed to initialize GLPI session');
        }
    }

    async createTicket(data) {
        try {
            const response = await axios.post(`${this.baseURL}/Ticket`, data, {
                headers: {
                    'Session-Token': this.sessionToken,
                    'App-Token': this.appToken
                }
            });
            return response.data;
        } catch (error) {
            logger.error('Error creating ticket:', error);
            throw new Error('Failed to create ticket');
        }
    }

    async updateUser(userId, data) {
        try {
            const response = await axios.put(`${this.baseURL}/User/${userId}`, data, {
                headers: {
                    'Session-Token': this.sessionToken,
                    'App-Token': this.appToken
                }
            });
            return response.data;
        } catch (error) {
            logger.error('Error updating user:', error);
            throw new Error('Failed to update user');
        }
    }
}

module.exports = new GLPIApi();
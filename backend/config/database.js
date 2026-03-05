const mongoose = require('mongoose')
const logger = require('../utils/logger')
const { config } = require('./environnement')

const connectDatabase = async () => {
    try {
        const options = {
            maxPoolSize: 10, // Maintenir jusqu'à 10 connexions socket
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        };
        await mongoose.connect(config.database.uri, options)
        mongoose.connection.on('error', (error) => {
            logger.error('Database connection error', { error });
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('Database disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            logger.info('Database reconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            logger.info('Database connection closed through app termination');
        });
    } catch (error) {
        logger.error('Database connection failed:', { error: error.message });
        process.exit(1);
    }
}

module.exports = connectDatabase
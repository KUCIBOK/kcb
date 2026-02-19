require('dotenv').config()
const mongoose = require('mongoose')

const connectDatabase = async () => {
    try {
        const options = {
            maxPoolSize: 10, // Maintenir jusqu'à 10 connexions socket
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        };
        await mongoose.connect(process.env.MONGODB_URI, options)
        mongoose.connection.on('error', (error) => {
            console.error('❌ Database connection error:', error);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ Database disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.info('🔄 Database reconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.info('💾 Database connection closed through app termination');
        });
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}

module.exports = connectDatabase
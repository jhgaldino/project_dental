const mongoose = require('mongoose');
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || '27017';
const url = 'mongodb://localhost:27017/dentist-db';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const connectDb = async () => {
    try {
        await mongoose.connect(url);
        console.log('Connected to mongodb');
    } catch (error) {
        console.error('Could not connect to the database', error);
    }
};

module.exports = connectDb;
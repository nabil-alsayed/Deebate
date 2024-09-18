const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

// DB Variables
var mongoURI = process.env.MONGODB_URI;

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB: ' + conn.connection.host);
    } catch (error) {
        console.error(`Error connecting to MongoDB ${mongoURI} : ` + error);
        process.exit(1);
    }
};

module.exports = { connectDb };

const mongoose = require("mongoose");

const DB_URL = process.env.MONGO_URI;

async function initMongo() {
    try {
        await mongoose.connect(DB_URL);

        console.log("****************************");
        console.log("*    Starting Server");
        console.log(`*    Port: ${process.env.PORT || 3000}`);
        console.log(`*    NODE_ENV: ${process.env.NODE_ENV}`);
        console.log(`*    Database: MongoDB (Mongoose)`);
        console.log("*    DB Connection: OK");
        console.log("****************************");

        return mongoose.connection;
    } catch (err) {
        console.error("DB Connection Error:", err);
        process.exit(1);
    }
}

module.exports = {
    initMongo
};

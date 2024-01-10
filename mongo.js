const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

require("dotenv").config();

const {
    MONGO_URL,
    MONGO_USERNAME,
    MONGO_PASSWORD
} = process.env;

mongoose.connect(MONGO_URL, { 
    auth: { 
        user: MONGO_USERNAME,   
        password: MONGO_PASSWORD 
    },
    useNewUrlParser: true, useUnifiedTopology: true
});
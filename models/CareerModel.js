const mongoose = require('mongoose');
require('../mongo');

const career_Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    
    description: {
        type:  String,
        default: null
    },
    status: {
        type: String,
        default: false
      },
     priority: {
        type: Number,
        required: true
      },
   

})
var CareerModel = mongoose.model('marspoles-career', career_Schema);
module.exports = CareerModel;
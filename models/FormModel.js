const mongoose = require("mongoose");
require("../mongo");

const elevatorplus_form_Schema = new mongoose.Schema({
  name: {
    type: String,

  },
  email: {
    type: String,
    default: null
  },
  phone: {
    type: Number,
    default: false
  },
  subject: {
    type: String,

  },
  massege: {
    type: String,

  }
});
var elevatorPlusModel = mongoose.model(
  "elevatorplus-form",
  elevatorplus_form_Schema
);
module.exports = elevatorPlusModel;

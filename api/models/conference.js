// Define schema
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var conferenceSchema = new Schema({
  name: String,
  security: { enabled: Boolean, password: {type: String, default: ''} },
  description: {type: String, required: true, default: ''},
  committees: [String],
  dateOfCreation: Date,
  scheduledFor: Date,
  status: { active: Boolean, attendance: {planned: Number, actual: Number} }

});

conferenceSchema.path('_id');


// Compile model from schema
var conference = mongoose.model('conference', conferenceSchema );
module.exports = conference;

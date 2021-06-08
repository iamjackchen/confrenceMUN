// Define schema
const mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema({
  name: {type: String, required: true},
  password: {type: String, minLength: 8, required: true},
  salt: {type: String, minLength: 8, required: true},
  email: {type: String, required: true},
  conferences: [String],
  membership: {type: String, enum: ['Free', 'Plus', 'Premium'], required: true},
  dateOfCreation: Date

});

userSchema.path('_id');


// Compile model from schema
var user = mongoose.model('user', userSchema );
module.exports = user;

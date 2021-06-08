// Define schema
const mongoose = require('mongoose');
var Schema = mongoose.Schema;


var testSchema = new Schema({
  test: String

});

testSchema.path('_id'); 

// Compile model from schema
var test = mongoose.model('test', testSchema );
module.exports = test;

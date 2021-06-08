// Define schema
const mongoose = require('mongoose');
var Schema = mongoose.Schema;



var committeeSchema = new Schema({
  name: String,
  security: { enabled: boolean, password: {type: String, default: ''} },

  delegations: [{country: String, name: String}],
  officers: [{position: String, name: String}],
  topics: [String],

  resolutions: [
    { filepath: String, //to be removed later, filepath will use objectID instead of separate
      title: String,
      timeSubmitted: Date,
      mainSubmitters: {type: [String], required: true},
      mainCosubmitters: [String],
      Cosubmitters: [String],
      approved: {type: Boolean, default: false},
      passed: {type: Boolean, default: false},
    }],

  amendments: [{
      type: { type: String, required: true, enum: ['Add', 'Modify', 'Strike'] },
      body: { type: String, default: ''},
      target: {resolution: {type: String, required: true},
               clause: {type: Number, required: true},
               subclause: Number,
               subsubclause: Number
             },
      approved: {type: Boolean, default: false},
      passed: {type: Boolean, default: false},


      timeSubmitted: Date,
      submitter: String,

    }],

  messages: [ {sender: String,
               recipient: String,
               body: String,
               timeSent: Date
             }],





  status: String,
  joinCode: Number

});

committeeSchema.path('_id');



// Compile model from schema
var committeeSchema = mongoose.model('committee', committeeSchema );
module.exports = committee;

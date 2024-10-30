const mongoose = require('mongoose');

const inviteRequestSchema = new mongoose.Schema({
  name:{type:String,required:true},
  contact:{type:String,required:true},

  eventName:{type:String,require:true},
  eventDate:{ type: Object,required:true},
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('inviteRequest', inviteRequestSchema);

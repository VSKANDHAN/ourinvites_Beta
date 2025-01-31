const mongoose = require('mongoose');

const feedbackDataSchema = new mongoose.Schema({
  name:{type:String,required:true},
  email:{type:String,required:false},
  contact:{type:String,required:false},
  rating:{type:String,require:false},
  loved:{type:String,require:false},
  improvements:{type:String,require:false},
  comments:{type:String,require:false},
  booksCount:{type:String,require:false},
  booksName:{type:String,require:false},
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('feedbackData', feedbackDataSchema);

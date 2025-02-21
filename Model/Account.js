const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const transactionSchema = new Schema({
  type: {
    type: String,
    enum: ['withdrawal', 'deposit','donate'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  }
});

const account = new Schema({
  balance: {
    type: Number,
    default: 0
  },
  transactions: {
    type: [transactionSchema], 
    default: []
  },
  user:{
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });


module.exports = mongoose.model('Account', account);

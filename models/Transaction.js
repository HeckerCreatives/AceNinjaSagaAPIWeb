const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    transactionid: { // paypal transactionid
      type: String,
      required: true,
      unique: true,
      index: true, // Automatically creates an index on 'transactionid' 
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Characterdata', 
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Items', // Reference to the Items collection
    },
    name: {
      type: String,
      required: true, // Name of the item being purchased
    },
    email: {
      type: String,
      required: true, // Email of the user making the transaction
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      enum: ['PayPal', 'Credit Card', 'Bank Transfer'],
    },
    currency: {
      type: String,
      default: 'USD', 
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    items: [
      {
        name: { type: String, required: true }, // crystal, coins, packages
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }, 
      },
    ],
  },
  {
    timestamps: true, 
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;

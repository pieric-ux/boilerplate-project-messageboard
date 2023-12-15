const mongoose = require('mongoose');
const { Schema } = mongoose;

const ThreadSchema = new mongoose.Schema({
  board: { type: String, required: true },
  text: { type: String, required: true },
  created_on: { type: Date, default: new Date() },
  bumped_on: { type: Date, default: new Date() },
  reported: { type: Boolean, default: false},
  delete_password: { type: String, required: true },
  replies: [{ type: Schema.Types.ObjectId, ref: 'Reply' }]
});

const Thread = mongoose.model('Thread', ThreadSchema);

module.exports = Thread;
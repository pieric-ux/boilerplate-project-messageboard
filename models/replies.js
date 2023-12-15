const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReplySchema = new mongoose.Schema({
  thread_id: { type: Schema.Types.ObjectId, ref: 'Thread', required: true },
  text: { type: String, required: true },
  created_on: { type: Date, default: new Date() },
  delete_password: { type: String, required: true },
  reported: { type: Boolean, default: false}
});

const Reply = mongoose.model('Reply', ReplySchema);

module.exports = Reply;
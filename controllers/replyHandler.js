const Thread = require('./../models/threads');
const Reply = require('./../models/replies');

class ReplyHandler {

  async getReplies(board, thread_id) {
    
    if (!board || !thread_id) {
      throw new Error('Missing required parameters');
    }
    
    try {
      return Thread
        .findOne({ board: board, _id: thread_id })
        .select('-board -delete_password -reported -__v')
        .populate({
          path: 'replies',
          select: '-thread_id -delete_password -reported -__v'
        });
    }
    catch (err) {
      throw err;
    }
  }
  
  async createReply(board, thread_id, text, delete_password) {
    
    if (!board || !thread_id || !text || !delete_password) {
      throw new Error('Missing required fields');
    }
    
    try {
      const thread = await Thread.findOne({ board: board, _id: thread_id });
      
      if (!thread) {
        throw new Error('Thread not found');
      }
      
      const reply = await Reply.create({
        thread_id: thread_id,
        text: text,
        delete_password: delete_password
      });

      thread.replies.push(reply._id);
      thread.bumped_on = reply.created_on;

      await thread.save();
    }
    catch (err) {
      throw err;
    }
  }

  async reportReply(board, thread_id, reply_id) {
    
    try {
      await Thread.findByIdAndUpdate(thread_id, { bumped_on: new Date() });
      await Reply.findByIdAndUpdate(reply_id, { reported: true });
    }
    catch (err) {
      throw err;
    }
  }

  async deleteReply(board, thread_id, reply_id, delete_password) {
    
    if (!board || !thread_id || !reply_id || !delete_password) {
      throw new Error('Missing required fields');
    }
    
    try {
      const thread = await Thread.findOne({ board: board, _id: thread_id});
      if (!thread) {
        throw new Error('Thread not found');
      }
      const reply = await Reply.findOne({ thread_id: thread_id, _id: reply_id });
      if (!reply) {
        throw new Error('Reply not found');
      }
      if (reply.delete_password !== delete_password) {
        return false;
      }
      reply.text = '[deleted]';
      await reply.save();
      
      return true;
    }
    catch (err) {
      throw err;
    }
  }
}

module.exports = ReplyHandler;
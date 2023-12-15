const Thread = require('./../models/threads');
const Reply = require('./../models/replies');

class ThreadHandler {

  async getThreads(board) {
    
    try {
      const threads = await Thread
        .find({ board })
        .select('-board -delete_password -reported -__v')
        .populate({
          path: 'replies',
          select: '-thread_id -delete_password -reported -__v',
          options: {
            sort: { created_on: 'desc' },
            limit: 3
          }
        })
        .sort({ bumped_on: 'desc' })
        .limit(10);

      const threadsWithReplyCount = await Promise.all(threads.map(async thread => {
        const replycount = await Reply.countDocuments({ thread_id: thread._id});
        return { ...thread.toObject(), replycount };
      }));

      return threadsWithReplyCount;
    }
    catch (err) {
      throw err;
    }
  }
  
  async createThread(board, text, delete_password) {
    
    if (!board || !text || !delete_password) {
      throw new Error('Missing required fields');
    }
    
    try {
      await Thread.create({ 
        board: board, 
        text: text, 
        delete_password: delete_password 
      });
    }
    catch (err) {
      throw err;
    }
  }

  async reportThread(board, thread_id) {
    
    try {
      await Thread.findByIdAndUpdate(thread_id, { reported: true, bumped_on: new Date() });
    }
    catch (err) {
      throw err;
    }
  }

  async deleteThread(board, thread_id, delete_password) {
    
    if (!board || !thread_id || !delete_password) {
      throw new Error('Missing required fields');
    }
    
    try {
      const thread = await Thread.findOne({ board: board, _id: thread_id });
      if (thread.delete_password !== delete_password) {
        return false;
      }
      await Thread.deleteOne({ _id: thread_id });
      await Reply.deleteMany({ thread_id: thread_id });
      
      return true;
    }
    catch (err) {
      throw err;
    }
  }
}

module.exports = ThreadHandler;
'use strict';

const ThreadHandler = require('./../controllers/threadHandler');
const ReplyHandler = require('./../controllers/replyHandler');

module.exports = function (app) {

  const threadHandler = new ThreadHandler();
  const replyHandler = new ReplyHandler();
  
  app.route('/api/threads/:board')
    
    .get(async function (req, res) {
        const { board } = req.params;
      
      try {
        const data = await threadHandler.getThreads(board);
        res.json(data);
      }
      catch (err) {
        throw err;
      }
    })
    
    .post(async function (req, res) {
      const { board } = req.params;
      const { text, delete_password } = req.body;
      
      try {
        await threadHandler.createThread(board, text, delete_password);
        res.redirect(`/b/${board}/`);
      }
      catch (err) {
        throw err;
      }
    })
    
    .put(async function (req, res) {
      const { board } = req.params;
      const { thread_id } = req.body;

      try {
        await threadHandler.reportThread(board, thread_id);
        res.send('reported');
      }
      catch (err) {
        throw err;
      }
    })
    
    .delete(async function (req, res) {
      const { board } = req.params;
      const { thread_id, delete_password } = req.body;
      
      try {
        const isSuccess = await threadHandler.deleteThread(board, thread_id, delete_password);
        
        isSuccess ? res.send('success') : res.send('incorrect password');
      }
      catch (err) {
        throw err;
      }
    });
    
  app.route('/api/replies/:board')
    
    .get(async function (req, res) {
      const { board } = req.params;
      const { thread_id } = req.query;
      
      try {
        const data = await replyHandler.getReplies(board, thread_id);
        res.json(data);
      }
      catch (err) {
        throw err;
      }
    })
    
    .post(async function (req, res) {
      const { board } = req.params;
      const { thread_id, text, delete_password } = req.body;

      try {
        await replyHandler.createReply(board, thread_id, text, delete_password);
        res.redirect(`/b/${board}/${thread_id}`);
      }
      catch (err) {
        throw err;
      }
    })
    
    .put(async function (req, res) {
      const { board } = req.params;
      const { thread_id, reply_id } = req.body;

      try {
        await replyHandler.reportReply(board, thread_id, reply_id);
        res.send('reported');
      }
      catch (err) {
        throw err;
      }
    })
    
    .delete(async function (req, res) {
      const { board } = req.params;
      const { thread_id, reply_id, delete_password } = req.body;

      try {
        const isSuccess = await replyHandler.deleteReply(board, thread_id, reply_id, delete_password);

        isSuccess ? res.send('success') : res.send('incorrect password');
      }
      catch (err) {
        throw err;
      }
    });
};

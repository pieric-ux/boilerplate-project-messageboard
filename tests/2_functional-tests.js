const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  var thread_id;
  var reply_id;

  test("Creating a new thread: POST request to /api/threads/{board}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/threads/general")
      .send({
        text: "test",
        delete_password: "test",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        done();
      });
  });

  test("Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .get("/api/threads/general")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.isAtMost(res.body.length, 10);
        thread_id = res.body[0]._id;
        done();
      });
  });

  test("Reporting a thread: PUT request to /api/threads/{board}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .put("/api/threads/general")
      .send({
        report_id: thread_id,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, "reported");
        done();
      });
  });

  test('Creating a new reply: POST request to /api/replies/{board}', function (done) {
    chai
    .request(server)
    .keepOpen()
    .post('/api/replies/general')
    .send({
      thread_id: thread_id,
      text: 'test',
      delete_password: 'test'
    })
    .end(function (err, res) {
      assert.equal(res.status, 200);
      done();
    });
  });

  test('Viewing a single thread with all replies: GET request to /api/replies/{board}', function (done) {
    chai
    .request(server)
    .keepOpen()
    .get('/api/replies/general')
    .query({
      thread_id: thread_id
    })
    .end(function (err, res) {
      assert.equal(res.status, 200);
      assert.isObject(res.body);
      reply_id = res.body.replies[0]._id;
      done();
    });
  });

  test('Reporting a reply: PUT request to /api/replies/{board}', function (done) {
    chai
    .request(server)
    .keepOpen()
    .put('/api/replies/general')
    .send({
      thread_id: thread_id,
      reply_id: reply_id
    })
    .end(function (err, res) {
      assert.equal(res.status, 200);
      assert.equal(res.text, 'reported');
      done();
    });
  });

  test('Deleting a reply with the incorrect password: DELETE request to /api/replies/{board} with an invalid delete_password', function (done) {
    chai
    .request(server)
    .keepOpen()
    .delete('/api/replies/general')
    .send({
      thread_id: thread_id,
      reply_id: reply_id,
      delete_password: 'incorrect'
    })
    .end(function (err, res) {
      assert.equal(res.status, 200);
      assert.equal(res.text, 'incorrect password');
      done();
    });
  });

  test('Deleting a reply with the correct password: DELETE request to /api/replies/{board} with a valid delete_password', function (done) {
    chai
    .request(server)
    .keepOpen()
    .delete('/api/replies/general')
    .send({
      thread_id: thread_id,
      reply_id: reply_id,
      delete_password: 'test'
    })
    .end(function (err, res) {
      assert.equal(res.status, 200);
      assert.equal(res.text, 'success');
      done();
    });
  });

  test("Deleting a thread with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password", function (done) {
    chai
      .request(server)
      .keepOpen()
      .delete("/api/threads/general")
      .send({
        thread_id: thread_id,
        delete_password: "incorrect",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, "incorrect password");
        done();
      });
  });

  test("Deleting a thread with the correct password: DELETE request to /api/threads/{board} with a valid delete_password", function (done) {
    chai
      .request(server)
      .keepOpen()
      .delete("/api/threads/general")
      .send({
        thread_id: thread_id,
        delete_password: "test",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, "success");
        done();
      });
  });

});

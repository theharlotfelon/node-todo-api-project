const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

var {app} = require('../server');
var {ToDo} = require('../models/todo');

const todos = [{
    _id: new ObjectId(),
    text: 'first todo'
}, {
    _id: new ObjectId(),
    text: 'second todo',
    completed: true,
    completedAt: 333
}
];

beforeEach(function (done) {
    ToDo.remove({}).then(function () {
        return ToDo.insertMany(todos);
    }).then(function () {
        done();
    });
});

describe('POST /todos', function () {
    it('should create a new todo', function (done) {
        var text = 'todo text';

        request(app)
            .post('/todos')
            .send({
                text: text
            })
            .expect(200)
            .expect(function (res) {
                expect(res.body.text).toBe(text);
            })
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                ToDo.find({text}).then(function (todo) {
                    expect(todo.length).toBe(1);
                    expect(todo[0].text).toBe(text);
                    done();
                }).catch(function (e) {
                    done(e);
                });
            });
    });
    it('should not create todo with invalid body data', function (done) {

        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                ToDo.find().then(function (todo) {
                    expect(todo.length).toBe(2);
                    done();
                }).catch(function (e) {
                    done(e);
                });
            });
    });
});

describe('GET /todos', function () {
    it('should retrieve todos', function (done) {
        request(app)
            .get('/todos')
            .expect(200)
            .expect(function (res) {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos:id', function () {
    it('should GET todo from id', function (done) {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect(function (res) {
                expect(res.body.todo._id).toBe(todos[0]._id.toHexString());
            })
            .end(done);
    });

    it('should return 404 if todo not found', function (done) {
        var newId = new ObjectId;
        request(app)
            .get(`/todos/${newId.toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-Object Ids', function (done) {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos:id', function () {
    it('should DELETE todo from id', function (done) {
        var hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect(function (res) {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                ToDo.findById(hexId).then(function (todo) {
                    expect(todo).toNotExist();
                    done();
                }).catch(function (e) {
                    done(e);
                });
            });
    });


    it('should return 404 if todo not found', function (done) {
        var deleteId = new ObjectId;
        request(app)
            .delete(`/todos/${deleteId.toHexString()}`)
            .expect(404)
            .end(done);
    });
    it('should return 404 if objectid is invalid', function (done) {
        request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('PATCh /todos/:id', function () {
    it('should update the todo', function (done) {
        var hexId = todos[0]._id.toHexString();
        var newText = 'Changing per the test';

        request(app)
            .patch(`/todos/${hexId}`)
            .send(
                {
                    text: newText,
                    completed: true
                }
            )
            .expect(200)
            .expect(function (res) {
                expect(res.body.todo.text).toBe(newText); //figure out how to get the send information here
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
                done();
            }).catch(function (e) {
            done(e);
        });
    });
    it('should clear completedAt when todo is not completed', function (done) {
        var hexId = todos[1]._id.toHexString();
        var newText = 'second test change';

        request(app)
            .patch(`/todos/${hexId}`)
            .send(
                {
                    text: newText,
                    completed: false
                }
            )
            .expect(200)
            .expect(function (res) {
                expect(res.body.todo.text).toBe(newText);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
                done();
            }).catch(function (e) {
            done(e);
        });
    });
});
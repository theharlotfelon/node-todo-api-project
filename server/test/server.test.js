const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

var {app} = require('../server');
var {ToDo} = require('../models/todo');
var {User} = require('../models/user');
const {todos, populateToDos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateToDos);

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

describe('GET /users/me', function() {
    it('should return user if authenticated', function (done) {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(function(res) {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return a 401 if not authenticated', function (done){
        request(app)
            .get('/users/me')
            .expect(401)
            .expect(function(res) {
                expect(res.body).toEqual({})
            })
            .end(done);
    });
});

describe('POST /users', function() {
    it('it should create a user', function (done) {
        var email = 'example@example.com';
        var password = 'password123$'

        request(app)
            .post('/users')
            .send({
                email: email,
                password: password
            })
            .expect(200)
            .expect(function (res) {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end(function(err) {
                if (err) {
                    return done(err);
                }
                User.findOne({email}).then(function(user) {
                    expect(user).toExist();
                    expect(user.password).toNotEqual(password);
                    done();
                });
            });
    });
    it('should return validation errors if request is invalid', function(done) {
        request(app)
            .post('/users')
            .send({
                email: 'rerj1232',
                password: 'password123$'
            })
            .expect(400)
            .end(done);
    });
    it('should not create user if email is in use', function (done) {
        request(app)
            .post('/users')
            .send({
                email: users[1].email,
                password: 'password123$'
            })
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', function() {
    it('should login user and return auth token', function(done) {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect(function (res) {
                expect(res.headers['x-auth']).toExist();
            })
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                User.findById(users[1]._id).then(function(user) {
                   expect(user.tokens[0]).toInclude({
                       access: 'auth',
                       token: res.headers['x-auth']
                   });
                   done();
                }).catch(function (e) {
                    done(e);
        });
            });
    });
    it('should reject invalid login', function(done) {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: 'password321'
            })
            .expect(400)
            .expect(function(res) {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                User.findById(users[1]._id).then(function(user) {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch(function(e) {
                    done(e);
                });
            });
    });
});

describe('DELETE /users/me/token', function() {
    it('should remove auth token on log out', function (done) {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                User.findById(users[0]._id).then(function (user) {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch(function (e) {
                    done(e);
                });
            });
    });
});
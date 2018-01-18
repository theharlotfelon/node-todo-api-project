const expect = require('expect');
const request = require('supertest');

var {app} = require('../server');
var {ToDo} = require('../models/todo');

const todos = [{
    text: 'first todo'
}, {
    text: 'second todo'
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
    it('should retrieve todos', function (done){
        request(app)
            .get('/todos')
            .expect(200)
            .expect(function(res) {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    })
})
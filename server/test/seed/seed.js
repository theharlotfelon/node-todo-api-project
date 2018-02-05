const {ObjectId} = require('mongodb');
const jwt = require(('jsonwebtoken'));

const {ToDo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();

const users = [{
    _id: userOneId,
    email: 'george@example.com',
    password: 'user1pass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'mark@example.com',
    password: 'user2pass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, 'abc123').toString()
    }]
}
];

const todos = [{
    _id: new ObjectId(),
    text: 'first todo',
    _creator: userOneId
}, {
    _id: new ObjectId(),
    text: 'second todo',
    completed: true,
    completedAt: 333,
    _creator: userTwoId
}
];

const populateToDos = function (done) {
    ToDo.remove({}).then(function () {
        return ToDo.insertMany(todos);
    }).then(function () {
        done();
    });
};

const populateUsers = function (done) {
    User.remove({}).then(function() {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo])
    }).then(function() {
        done();
    })
};

module.exports = {todos, populateToDos, users, populateUsers};
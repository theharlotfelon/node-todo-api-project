require('./config/config');
const {ObjectId} = require('mongodb');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

var mongoose = require('./db/mongoose');
var {ToDo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
var port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', function (req, res) {
    var todo = new ToDo({
        text: req.body.text
    });
    todo.save().then(function (doc) {
        res.send(doc);
    }, function (e) {
        res.status(400).send(e);
    });
});

app.get('/todos', function (req, res) {
    ToDo.find().then(function (todos) {
        res.send({todos: todos});
    }, function (e) {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', function (req, res) {
    var id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(404).send();
    }
    ToDo.findById(id).then(function (todo) {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch(function (e) {
        res.status(400).send();
    });
});

app.delete('/todos/:id', function (req, res) {
    var id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(404).send();
    }
    ToDo.findByIdAndRemove(id).then(function (todo) {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch(function (e) {
        res.status(400).send();
    });
});

app.patch('/todos/:id', function (req, res) {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectId.isValid(id)) {
        return res.status(404).send();
    }
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    ToDo.findByIdAndUpdate(id, {$set: body}, {new: true}).then(function (todo) {
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo: todo});
    }).catch(function(e) {
        res.status(400).send();
    })
});

app.listen(port, function () {
    console.log(`Started on port ${port}`);
});

module.exports = {
    app: app
};
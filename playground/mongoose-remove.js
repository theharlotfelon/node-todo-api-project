const {ObjectId} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {ToDo} = require('../server/models/todo');
const {User} = require('../server/models/user');

// ToDo.remove({}).then(function(result) {
//     console.log(result);
// });
//
// ToDo.findOneAndRemove().then(function(result) {
//     console.log(result);
// });

ToDo.findByIdAndRemove('5a657348ec1c9815e6507d08').then(function(todo) {
    console.log(todo);
})
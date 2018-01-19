const {ObjectId} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {ToDo} = require('../server/models/todo');
const {User} = require('../server/models/user');

var userId = '5a5ed5b619d654327800d7d6';
// var id = '5a604c16b1c1505291da8b5f';

// if(!ObjectId.isValid(id)) {
//     console.log('Id not valid');
// }

// ToDo.find({
//     _id: id
// }).then(function (todo) {
//     console.log('ToDos', todo);
// }, function (e) {
//     console.log('Error', e);
// });
//
// ToDo.findOne({
//     _id: id
// }).then(function(todo) {
//     console.log('ToDo', todo);
// }, function(e) {
//     console.log('Error', e);
// });

// ToDo.findById(id).then(function(todo) {
//     if(!todo) {
//         return console.log('Id not found');
//     }
//     console.log('FindById', todo);
// }).catch(function(err) {
//     console.log(err.message);
// });

// User.findbyid to find id (require user model), handle 3 cases. (works, no user)(was found, print user)(handle errors)
User.findById(userId).then(function(user) {
    if(!user) {
        return console.log('No User found.');
    }
    console.log(JSON.stringify(user, undefined, 4));
}, function (err) {
    console.log(err);
});
var mongoose = require('mongoose');

var User = mongoose.model('User', {
    email : {
        require: true,
        trim: true,
        minLength: 1,
        type: String
    }
});

module.exports = {
    User: User
};
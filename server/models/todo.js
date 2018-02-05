var mongoose = require('mongoose');

var ToDo = mongoose.model('ToDo', {
    text: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    },
    completed :  {
        type: Boolean,
        default: false
    },
    completedAt : {
        type: Number,
        default: null
    },
    _creator : {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

module.exports =  {
    ToDo: ToDo
};
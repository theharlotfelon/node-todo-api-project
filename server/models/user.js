const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        required: true,
        trim: true,
        minLength: 1,
        type: String,
        unique: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access: access}, 'abc123').toString();

    user.tokens.push({access: access, token: token});

    return user.save().then(function () {
        return token;
    });
};

UserSchema.methods.removeToken = function (token) {
  var user = this;

  return user.update({
      $pull: {
          tokens: {
              token: token
          }
      }
  });
};

UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
};

UserSchema.pre('save', function(next) {
    var user = this;

    if(user.isModified('password')) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, res) {
                user.password = res;
                next();
            })
        });
    } else {
        next();
    }
});

UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;

    return User.findOne({email}).then(function(user) {
        if(!user) {
            return Promise.reject();
        }

        return new Promise(function (resolve, reject) {
            bcrypt.compare(password, user.password, function(err, res) {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        })
    });
};

var User = mongoose.model('User', UserSchema);

module.exports = {
    User: User
};
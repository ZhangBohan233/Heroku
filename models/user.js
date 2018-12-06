/* User model */
const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs');
const fs = require('fs');

const DEFAULT_ICON = '/resources/userPic.jpg';

const NoteSchema = new mongoose.Schema({
    title: String,
    author: String,
    date: String,
    content: String
});

const IconSchema = new mongoose.Schema({
    img: {
        data: Buffer,
        contentType: String
    }
});

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 1,
        unique: true
    },
    email: {
        type: String,
        required: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Not valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    isAdmin: {
        type: Boolean
    },
    birthday: {
        type: String
    },
    notes: {
        type: [NoteSchema]
    },
    icon: {
        type: IconSchema
    }
});

UserSchema.statics.findByUsernamePassword = function (username, password) {
    const User = this;

    return User.findOne({username:username}).then((user) => {
        if (!user) {
            return Promise.reject()
        } else {
            return new Promise((resolve, reject) => {
                bcrypt.compare(password, user.password, (error, result) => {
                    if (result) {
                        resolve(user)
                    } else {
                        reject()
                    }
                })
            })
        }
    })
};

UserSchema.pre('save', function(next) {
    const user = this;

    // check to make sure we don't hash again
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(user.password, salt, (error, hash) => {
                user.password = hash;
                next()
            })
        })
    } else {
        next();
    }
});

const User = mongoose.model('User', UserSchema);
const Note = mongoose.model('Note', NoteSchema);

module.exports = { User };

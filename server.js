/* Server js */
'use strict';

const log = console.log;

const express = require('express');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser'); // middleware for parsing HTTP body from client
const session = require('express-session');
const {ObjectID} = require('mongodb');

// Import our mongoose connection
const {mongoose} = require('./db/mongoose');

// Import the models
const {User} = require('./models/user');

// express
const app = express();
// body-parser middleware setup.  Will parse the JSON and convert to object
app.use(bodyParser.json());
// parse incoming parameters to req.body
app.use(bodyParser.urlencoded({extended: true}));

// session
app.use(session({
    secret: 'somesecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60000,
        httpOnly: true
    }
}));

const sessionChecker = (req, res, next) => {
    if (req.session.user) {
        log(req.session.user);
        res.redirect('index/index_logged_in')
    } else {
        log("next");
        next()
    }
};

// User login
app.post('/user/login', sessionChecker, (req, res) => {
    log("login");
    const username = req.body.username;
    const password = req.body.password;

    User.findByUsernamePassword(username, password).then((user) => {
        if (!user) {
            // No such a user or wrong password.
            res.status(400).send("Authentication failed.")
        } else {
            req.session.user = user._id;
            res.redirect('index/index')
        }
    }).catch((error) => {
        res.status(400).redirect('login_sys/login')
    })
});

// Sign up
app.post('/user/sign_up', (req, res) => {
    log("sign up");

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirm = req.body.password_confirm;
    const isAdmin = req.body.is_admin;

    if (password !== passwordConfirm) {
        // TODO: I think this is not correct
        return res.status(400).send('Password do not match')
    }

    User.findOne({username: username}).then((user) => {
        if (!user) {
            const userSchema = new User({
                username: username,
                email: email,
                password: password,
                isAdmin: isAdmin
            });
            userSchema.save().then((result) => {
                res.send(result)
            }).catch((error) => {
                res.status(400).send(error)
            })
        } else {
            // Duplicate user found
            // TODO: I think this is not correct
            res.status(400).send("Username already used")
        }
    })

});


// Get user by username
app.get('/user/:username', (req, res) => {
    const username = req.params.username;

    User.findOne({username: username}).then((user) => {
        if (!user) {
            res.status(404).send()
        } else {
            res.send(user)
        }
    }).catch((error) => {
        res.status(400).send(error)
    })
});

// Get all users information
// Uses for admin
app.get('/user', (req, res) => {
    User.find().then((user) => {
        log(user);
        res.send({user})
    }, (error) => {
        res.status(400).send(error)
    })
});


app.get('/user/:id', (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }
    User.findById(id).then((user) => {
        log(user);
        res.send(user)
    }, (error) => {
        res.status(400).send(error)
    })
});

// Delete a user, admin use only
app.delete('/user/:id', (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }
    User.findByIdAndRemove(id).then((user) => {
        if (!user) {
            res.status(404).send()
        } else {
            res.send({user})
        }
    }).catch((error) => {
        res.status(400).send(error)
    })
});


// Change password
app.patch('/user/:id/password', (req, res) => {

    const id = req.params.id;
    const newPassword = req.body.password;
    const newPasswordConfirm = req.body.password_confirm;

    if (newPassword !== newPasswordConfirm) {
        // TODO: I think this is not correct
        log("Password do not match");
        return res.status(400).send('Password do not match')
    }

    User.findByIdAndUpdate(id, {$set: req.body.password}).then((user) => {
        if (!user) {
            res.status(404).send()
        } else {
            res.send({user})
        }
    }).catch((error) => {
        res.status(400).send(error)
    })

});


// Add new note
app.post('/user/:id', (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    User.findById(id).then((user) => {
        if (!user) {
            res.status(404).send()
        } else {
            user.notes.push({
                title: req.body.title,
                author: user.username,
                date: req.body.date,
                content: req.body.content
            });
            res.send({user});
            user.save()
        }
        log('posted')
    }).catch((error) => {
        res.status(400).send(error)
    })
});

app.post('/user/:username', (req, res) => {
    User.findOne({username: req.params.username}).then((user) => {
        if (!user) {
            res.status(404).send()
        } else {
            user.notes.push({
                title: req.body.title,
                author: user.username,
                date: req.body.date,
                content: req.body.content
            });
            res.send({user});
            user.save()
        }
        log('posted')
    }).catch((error) => {
        res.status(400).send(error)
    })
});

// Delete a note
app.delete('/user/:id/:note_id', (req, res) => {
    const id = req.params.id;
    const nid = req.params.note_id;

    if (!ObjectID.isValid(id) && !ObjectID.isValid(nid)) {
        return res.status(404).send()
    }

    User.findById(id).then((user) => {
        if (!user) {
            res.status(404).send()
        } else {
            user.notes.id(nid).remove();
            user.save();
            res.send({user})
        }
        log('deleted')
    }).catch((error) => {
        res.status(400).send(error)
    })
});

// Get a note by note_id
app.get('/user/:id/:note_id', (req, res) => {
    const id = req.params.id;
    const nid = req.params.note_id;

    if (!ObjectID.isValid(id) || !ObjectID.isValid(nid)) {
        return res.status(404).send()
    }

    User.findById(id).then((user) => {
        if (!user) {
            res.status(404).send()
        } else {
            const note = user.notes.id(nid);
            res.send({note})
        }
    }).catch((error) => {
        res.status(400).send(error)
    })
});


app.listen(port, () => {
    log(`Listening on port ${port}...`)
});

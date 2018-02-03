'use strict';
const express = require('express');
const uuid = require('uuid');
const session = require('express-session');
const fileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const app = express();

const users = [{id: '2f24vvg', email: 'test@test.com', passport: 'password'}];

passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  console.log('Inside local strategy callback');
  const user = users[0];
  if (email === user.email && password === user.password) {
    console.log('Local strategy returned true');
    return done(null, user);
  }
}
));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(session({
  genid: req => {
    console.log('Inside the session middleware');
    console.log('Req.sessionID', req.sessionID);
    return uuid(); //use uuids for session ids
  },
  store: new fileStore(),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.get('/', (req, res) => {
  console.log('Inside the homepage callback function');
  console.log(req.sessionID);
  res.send('You hit the homepage!\n');
});

app.get('/login', (req, res) => {
  console.log('Inside the GET / login callback function');
  console.log(req.sessionID);
  res.send('You got homepage!\n');
});

app.post('/login', (req, res) => {
  console.log('Inside POST /login callback function');
  console.log(req.body);
  res.send('You got the login page\n');
});

app.listen(8080, () => {
  console.log('App listening on localhost: 8080');
});



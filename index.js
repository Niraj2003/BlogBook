const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const session = require('express-session')

require('dotenv').config();

const db = require('./db/database');
const User = require('./models/User.js')
const port = 3000;

const posts = require('./routes/posts');
const users = require('./routes/users');

const passport = require('passport');
const methodOverride = require('method-override');
const LocalStategy = require('passport-local');
const { requireLogin } = require('./middleware');

app.set("views", "views");
app.set('view engine', 'ejs');

const sessionConfig = {
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig))

app.use(passport.initialize());
app.use(passport.session());

app.use("/",posts);
app.use('/',users);

app.get('/', (req, res) => res.send('This is Homepage'))

app.listen(port, () => console.log(`app listening on port ${port}!`))
const express = require('express');
const app = express();
const session = require('express-session');

require('dotenv').config();

const db = require('./db/database');
const port = 3000;

const posts = require('./routes/posts');
const users = require('./routes/users');

app.set("views", "views");
app.set('view engine', 'ejs');

const sessionConfig = {
  secret: 'mynameisnirajamrutkar!',
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

app.use("/",posts);
app.use('/',users);

app.get('/', (req, res) => res.send('This is Homepage'))

app.listen(port, () => console.log(`app listening on port ${port}!`))
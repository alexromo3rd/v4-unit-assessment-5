require('dotenv').config();
const express = require('express');
const massive = require('massive');
const session = require('express-session');
const { CONNECTION_STRING, SESSION_SECRET, SERVER_PORT } = process.env;
const userCtrl = require('./controllers/user');
const postCtrl = require('./controllers/posts');

const app = express();

app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 365 },
  })
);

massive({
  connectionString: CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
}).then((db) => {
  app.set('db', db);
  console.log('database connected');
});

// Auth Endpoints
app.post('/api/auth/register', userCtrl.register);
app.post('/api/auth/login', userCtrl.login);
app.get('/api/auth/me', userCtrl.getUser);
app.post('/api/auth/logout', userCtrl.logout);

// Post Endpoints
app.get('/api/posts', postCtrl.readPosts);
app.post('/api/post', postCtrl.createPost);
app.get('/api/post/:id', postCtrl.readPost);
app.delete('/api/post/:id', postCtrl.deletePost);

app.listen(SERVER_PORT, (_) => console.log(`running on ${SERVER_PORT}`));

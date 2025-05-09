const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'hbs');

const neededPath = path.join(__dirname, 'data', 'needed.json');
const needed = JSON.parse(fs.readFileSync(neededPath));
const title = needed.title;
const footer = needed.footer;

const accountsFile = path.join(__dirname, 'data', 'accounts.json');

function loadAccounts() {
  const data = fs.readFileSync(accountsFile);
  return JSON.parse(data);
}

function saveAccounts(accounts) {
  fs.writeFileSync(accountsFile, JSON.stringify(accounts, null, 2));
}

// Routes
app.get('/', (req, res) => {
  res.render('login.hbs', { title, footer });
});

app.get('/signup', (req, res) => {
  res.render('signup.hbs', { title, footer });
});

app.post('/signup', (req, res) => {
  const { username, password, email, birthdate } = req.body;
  const accounts = loadAccounts();

  if (accounts[username]) {
    return res.send(`
      <script>
        alert('Username already exists.');
        window.location.href = '/signup';
      </script>
    `);
  }

  accounts[username] = { password, email, birthdate };
  saveAccounts(accounts);

  res.redirect(`/home?user=${encodeURIComponent(username)}`);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const accounts = loadAccounts();

  if (!accounts[username] || accounts[username].password !== password) {
    return res.send(`
      <script>
        alert('Invalid username or password.');
        window.location.href = '/';
      </script>
    `);
  }

  res.redirect(`/home?user=${encodeURIComponent(username)}`);
});

app.get('/guest', (req, res) => {
  res.redirect('/home?user=Guest');
});

app.get('/home', (req, res) => {
  const username = req.query.user;
  res.render('home.hbs', { username, title, footer });
});

// Optional game routes
app.get('/applications', (req, res) => {
  const username = req.query.user;
  res.render('applications.hbs', { username, title, footer });
});

app.get('/RT', (req, res) => {
  const username = req.query.user;
  res.render('RT.hbs', { username, title, footer });
});

app.get('/minigames', (req, res) => {
  const username = req.query.user;
  res.render('minigames.hbs', { username, title, footer });
});

app.get('/ClickerGame', (req, res) => {
  const username = req.query.user;
  res.render('ClickerGame.hbs', { username, title, footer });
});

app.get('/about', (req, res) => {
  const username = req.query.user;
  res.render('about.hbs', { username, title, footer });
});

const port = 3000;
app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);

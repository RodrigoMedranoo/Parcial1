const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
app.use(session({ secret: 'your-secret', resave: false, saveUninitialized: true }));
app.use(cookieParser());

app.listen(4000, () => {
  console.log('Server listening on port 4000');
});

app.get('/', (req, res, next) => {
  const firstName = 'Rodrigo';
  const career = 'Cibernetica';
  const cookieOptions = { maxAge: 180000 };

  res.cookie('name', `${firstName} - ${career}`, cookieOptions);

  if (req.session.visits) {
    req.session.visits++;
    if (req.session.visits >= 5) {
      res.send('You have visited this page more than 5 times!');
    } else {
      res.send(`Welcome back, ${firstName}! You have visited this page ${req.session.visits} times.`);
    }
  } else {
    req.session.visits = 1;
    res.send(`Welcome for the first time, ${firstName}!`);
  }

  // Display the cookie in the DOM
  res.send(`
    <html>
      <body>
        <h1>Cookie: ${req.cookies.name}</h1>
      </body>
    </html>
  `);

  // Print the cookie in the console (from the server)
  console.log(`Cookie: ${req.cookies.name}`);
});

app.get('/cookies', (req, res) => {
  res.send(`Session visits: ${req.session.visits}<br>Cookie: ${JSON.stringify(req.cookies)}`);
});

let data = [
  { id: 1, name: 'ingredient1', type: 'type1', allergens: false },
  { id: 2, name: 'ingredient2', type: 'type2', allergens: true },
  { id: 3, name: 'ingredient3', type: 'type3', allergens: false }
];

app.get('/insumos/all', (req, res) => {
  res.send(data);
});

app.get('/insumos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = data.find(item => item.id === id);
  if (item) {
    res.send(item);
  } else {
    res.status(404).send('Item not found');
  }
});

app.put('/insumos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = data.findIndex(item => item.id === id);
  if (itemIndex !== -1) {
    const { id, name, type, allergens } = req.body;
    if (id && name && type && typeof allergens === 'boolean') {
      data[itemIndex] = { id, name, type, allergens };
      res.status(201).send(data[itemIndex]);
    } else {
      res.status(400).send('Bad Request');
    }
  } else {
    res.status(404).send('Item not found');
  }
});
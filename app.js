const express = require('express');
const app = express();
const fetch = require('node-fetch'); // Required for making API requests
const port = 3000;
const session = require('express-session');

app.use(session({
          secret: 'plkemon-memory-game',
          resave: false,
          saveUninitialized:true,
}));

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Serve static files from the "public" folder (e.g. CSS, JS, images)
app.use(express.static('public'));

// Generate an array of N unique random numbers between 1 and max
function getUniqueRandomNumbers(count, max) {
  const set = new Set();
  while (set.size < count) {
    set.add(Math.floor(Math.random() * max) + 1);
  }
  return Array.from(set);
}

// Fisher–Yates shuffle to randomize an array
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Asynchronously fetch 3 unique Pokémon and return 6 card objects (each pair duplicated)
async function loadPokemon(pairCount) {
  const ids = getUniqueRandomNumbers(pairCount, 1025); // Select 3 random Pokémon IDs
  let cards = [];
  let index = 0;

  for (const id of ids) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const json = await res.json();
    const img = json.sprites.other['official-artwork'].front_default;

    // Add two identical cards to form a matching pair
    cards.push({ number: index, link: img });
    console.log(index);
    cards.push({ number: ++index, link: img });
    console.log(index);
    index++;
  }

  return shuffle(cards); // Shuffle the final 6 cards
}

// Route to render the main game page
app.get('/', async (req, res) => {
          res.render('home');
});

// Jumpt to the level of difficulties
app.get('/play/:level', async (req, res) => {
  const level = req.params.level;
  let counter = 60;
  let pairs = 3;

  if (level === 'medium') {
    counter = 30;
    pairs = 3;
  }
  if (level === 'hard') {
    counter = 20;
    pairs = 4;
  }

  const pokermon = await loadPokemon(pairs); 
  req.session.pokermon = pokermon;
  req.session.counter = counter;
  req.session.pairs=pairs;
  req.session.level=level;
  res.render('index', { pokermon, counter, level, pairs });
});

app.get('/restart', async (req,res)=>{
          const pokermon = req.session.pokermon;
          const counter = req.session.counter;
          const level = req.session.level;
          const pairs = req.session.pairs
          if(!pokermon || !counter || !level || !pairs)
          {
                    res.redirect('/play/easy');
                    return;
          }

          shuffle(pokermon);
          res.render('index', {level, pokermon, counter, pairs});
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});



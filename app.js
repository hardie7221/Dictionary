const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Homepage with form
app.get('/', (req, res) => {
  res.render('index', { result: null, error: null });
});

// Handle form submission
app.post('/search', async (req, res) => {
  const word = req.body.word;
  if (!word) {
    return res.render('index', { result: null, error: 'Please enter a word.' });
  }
  try {
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    const data = response.data[0];
    const result = {
      word: data.word,
      phonetics: data.phonetics,
      meanings: data.meanings
    };
    res.render('index', { result, error: null });
  } catch (err) {
    res.render('index', { result: null, error: 'Word not found or API error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

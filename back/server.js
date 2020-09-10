const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

let results = [];

app.post('/ended', (req, res) => {
  let result = {
    score: req.body.score,
    name: req.body.name
  };

  results.push(result);
  console.log(`Uspesno dobio rezultat: ${result.score} ${result.name}`);
  res.send('Success');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})

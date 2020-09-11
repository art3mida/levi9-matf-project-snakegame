const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// Connecting to a database
mongoose.connect('mongodb://localhost/results', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// We have a pending connection to the test database running on localhost.
// We need to get notified if we connect successfully or if a connection
// error occurs.
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {

  // With Mongoose, everything is derived from a Schema.
  const resultSchema = new mongoose.Schema({
    name: String,
    score: mongoose.Number
  });

  //  The next step is compiling our schema into a Model.
  const Result = mongoose.model('Result', resultSchema);


  // Server communication
  const app = express();
  const port = 5000;

  app.use(bodyParser.json());
  app.use(cors());

  app.post('/ended', (req, res) => {
    const result = new Result({
      score: req.body.score,
      name: req.body.name
    });

    saveResultToDatabase(result);
    returnTopTenResults();

    res.send('Success');
  });

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  })

  function saveResultToDatabase(result) {
    // we're connected!
    result.save((err, result) => {
      if (err) {
        return console.error(err);
      }
      console.log('Result saved to database.');
    });

  }

  function printAllResults() {
    Result.find(function (err, results) {
    if (err) return console.error(err);
    console.log(results);
    });
  }

  function returnTopTenResults() {
    Result.find({})
      .sort({score: 'desc'})
      .limit(10)
      .exec(function(err, docs) {
        console.log(docs);
      });
  }

  app.get('/', (req, res) => {
    console.log('request na highscores');
    Result.find({})
        .sort({score: 'desc'})
        .limit(10)
        .exec((err, docs) => res.json(docs));
  });

});

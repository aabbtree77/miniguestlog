const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const router = require('./src/router');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.use('/favicon.ico', express.static('favicon.ico'));

app.use(router);

const PORT = process.env.PORT;

app.set('port', PORT);

//Update 2025.11.18: This is no longer enough as some wrong/old TLS
//version is defaulted:
/*
mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
})
*/

console.log('Mongoose version:', mongoose.version);

try {
  const mongodbVersion = require('mongodb/package.json').version;
  console.log("Actual MongoDB driver loaded:", mongodbVersion);
} catch (e) {
  console.log("Could not load mongodb driver:", e);
}

mongoose.connect(process.env.MONGO_URI, {
  tls: true,
  minTLSVersion: 'TLSv1.2'
})
.then(() => {
  app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
})
.catch(err => {
  console.error("MongoDB connection error:", err);
});


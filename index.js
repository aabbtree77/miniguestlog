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

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
})

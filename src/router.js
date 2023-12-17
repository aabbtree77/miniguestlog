const express = require('express');

const createGuestRoute = require('./routes/createGuestRoute');
const readGuestsRoute = require('./routes/readGuestsRoute');
const emptyRoute = require('./routes/emptyRoute');

const router = express.Router();

router.post('/guest', createGuestRoute);
router.get('/guests', readGuestsRoute);
router.get('/', emptyRoute);

module.exports = router;

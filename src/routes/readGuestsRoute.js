const GuestModel = require('../models/GuestModel');

module.exports = async (req, res) => {
  const guests = await GuestModel.find();
  res.json(guests);
}

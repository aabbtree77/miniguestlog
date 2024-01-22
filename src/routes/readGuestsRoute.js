const GuestModel = require('../models/GuestModel');

module.exports = async (req, res) => {
  const guests = await GuestModel.find().sort({$natural: -1}).limit(50);
  res.json(guests);
}

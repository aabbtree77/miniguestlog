const mongoose = require("mongoose");

const GuestSchema = new mongoose.Schema({
  date: {
    type: String,
  },
  time: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
});

const GuestModel = mongoose.model("Guest", GuestSchema);

module.exports = GuestModel;

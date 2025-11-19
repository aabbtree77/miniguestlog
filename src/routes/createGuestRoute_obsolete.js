const geoip = require("geoip-lite");

const GuestModel = require("../models/GuestModel");

module.exports = async (req, res) => {
  const guestObj = req.body;

  if (guestObj) {
    geo = geoip.lookup(guestObj.ip);
    
    let cityName = "Unknown";
    let countryName = "Unknown";
    if (geo) {
      cityName = geo.hasOwnProperty("city") ? geo.city : "Empty City";
      countryName = geo.hasOwnProperty("country")
        ? geo.country
        : "Empty Country";
    }

    const guest = new GuestModel({
      date: guestObj.date,
      time: guestObj.time,
      city: cityName,
      country: countryName,
    });

    const newGuest = await guest.save();

    res.json(newGuest);
  } else {
    res.json({ Result: "Request body is null, doing nothing." });
  }
};

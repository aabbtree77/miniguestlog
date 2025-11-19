const maxmind = require('@maxmind/geoip2-node');
const GuestModel = require("../models/GuestModel");

// Open DB once (sync)
const db = maxmind.openSync('./geo/GeoLite2-City.mmdb');

module.exports = async (req, res) => {
  const guestObj = req.body;

  if (!guestObj) {
    return res.json({ Result: "Request body is null, doing nothing." });
  }

  let cityName = "Unknown";
  let countryName = "Unknown";

  try {
    const geo = db.city(guestObj.ip);
    if (geo) {
      cityName = geo.city?.names?.en || "Empty City";
      countryName = geo.country?.iso_code || "Empty Country";
    }
  } catch (err) {
    console.error("Geo lookup error:", err);
  }

  const guest = new GuestModel({
    date: guestObj.date,
    time: guestObj.time,
    city: cityName,
    country: countryName,
  });

  const newGuest = await guest.save();
  res.json(newGuest);
};


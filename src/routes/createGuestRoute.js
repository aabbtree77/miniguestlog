const fs = require('fs');
const { Reader } = require('@maxmind/geoip2-node');
const GuestModel = require("../models/GuestModel");

// Read DB once at module load
const dbBuffer = fs.readFileSync('./geo/GeoLite2-City.mmdb');
const reader = Reader.openBuffer(dbBuffer);

module.exports = async (req, res) => {
  const guestObj = req.body;

  if (!guestObj) {
    return res.json({ Result: "Request body is null, doing nothing." });
  }

  let cityName = "Unknown";
  let countryName = "Unknown";

  try {
    const geo = reader.city(guestObj.ip);
    if (geo) {
      cityName = geo.city?.names?.en || "Empty City";
      countryName = geo.country?.isoCode || "Empty Country";
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


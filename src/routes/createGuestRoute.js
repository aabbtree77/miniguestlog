const maxmind = require("@maxmind/geoip2-node");
const fs = require("fs");

const db = new maxmind.Reader(fs.readFileSync("geo/GeoLite2-City.mmdb"));

module.exports = async (req, res) => {
  const guestObj = req.body;
  if (!guestObj) return res.json({ Result: "Request body is null, doing nothing." });

  const geo = db.get(guestObj.ip) || {};
  const cityName = geo.city?.names?.en || "Unknown";
  const countryName = geo.country?.iso_code || "Unknown";

  const guest = new GuestModel({
    date: guestObj.date,
    time: guestObj.time,
    city: cityName,
    country: countryName,
  });

  const newGuest = await guest.save();
  res.json(newGuest);
};


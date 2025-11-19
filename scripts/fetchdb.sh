#!/bin/bash
set -e

# Load environment variables from .env
export $(grep -v '^#' .env | xargs)

mkdir -p geo
echo "Downloading GeoLite2-City database..."
curl -L -o geo/GeoLite2-City.tar.gz \
     "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=$MAXMIND_LICENSE_KEY&suffix=tar.gz"
tar -xzf geo/GeoLite2-City.tar.gz -C geo --strip-components=1
echo "GeoLite2-City database ready."


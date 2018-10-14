import getLabel  from '~/utils/getters/getLabel'
import isObject  from '~/utils/misc/isObject'
import isNotNull from '~/utils/misc/isNotNull'

/**
 * Convert an array of Location entities into a geoJSON
 *
 */
export default function getGeoJSON (locations) {

  const result = {
    type: "FeatureCollection",
    features: []
  }

  if (!Array.isArray(locations) || locations.length === 0) {
    return Promise.resolve(result)
  }

  const features = [];
  locations.forEach(item => {

    if (!isObject(item)) {
      return
    }

    // search for the location - we use isObject on purpose, to match both
    // plain objects and arrays (which are also of type object)
    let location
    if (isObject(item.location)) {
      location = item.location
    } else if (isObject(item.value) && isObject(item.value.location)) {
      location = item.value.location
    } else if (isObject(item.entity) && isObject(item.entity.location)) {
      location = item.entity.location
    } else {
      return
    }

    const lat = parseFloat(Array.isArray(location) ? location[0] : location.lat)
    const lon = parseFloat(Array.isArray(location) ? location[1] : location.lon)

    if (isNaN(lat) || !isFinite(lat) || isNaN(lon) || !isFinite(lon)) {
      console.error("invalid lat/lon: ", { location: location, lat: lat, lon: lon })
      return;
    }
    //console.log("found a location! ", location);
    result.features.push({
      "type":"Feature",
      "properties": {
        "place": getLabel(item),
        "lat": `${lat}`,
        "lon": `${lon}`
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          lon,
          lat
        ]
      }
    })

  })

  return Promise.resolve(result)
}

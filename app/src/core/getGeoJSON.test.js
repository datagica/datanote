
import getGeoJSON from './getGeoJSON'

test('getGeoJSON', (done) => {
  getGeoJSON([
    {
      value: {
        label: {
          "en": "Paris"
        },
        location: [ 42.42, 24.24 ]
      }
    }
  ]).then(result => {
    expect(result).toEqual({
      features: [
        {
           geometry: {
             coordinates: [
               24.24,
               42.42
             ],
             type: "Point"
           },
           properties:  {
             lat: "42.42",
             lon: "24.24",
             place: "Paris"
           },
           type: "Feature"
         }
       ],
       type: "FeatureCollection"
     })
    done()
  })
})

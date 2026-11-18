const map = new mapboxgl.Map({
    accessToken: maptoken,
    container: 'map',
    style: 'mapbox://styles/mapbox/standard', // Use the standard style for the map
    projection: 'globe', // display the map as a globe
    zoom: 9, // initial zoom level, 0 is the world view, higher values zoom in
    center: coordinates // center the map on this longitude and latitude
});

console.log(coordinates)
const marker = new mapboxgl.Marker()
    .setLngLat(coordinates)  //listing.geometry.coordinates
    .setPopup(new mapboxgl.Popup({ offset: 25 })
    .setHTML("<h5>Exact Location will be provided after booking</h5>"))
    .addTo(map);

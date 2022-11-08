const data = [{ coords: [-71.0789, 42.363] }, { coords: [-71.118, 42.381] }];

const deckgl = new deck.DeckGL({
  container: "map",
  // Set your Mapbox access token here
  mapboxApiAccessToken:
    "pk.eyJ1Ijoibmlrby1kZWxsaWMiLCJhIjoiY2w5c3p5bGx1MDh2eTNvcnVhdG0wYWxkMCJ9.4uQZqVYvQ51iZ64yG8oong",
  // Set your Mapbox style here
  mapStyle: "mapbox://styles/niko-dellic/cl9t226as000x14pr1hgle9az",
  initialViewState: {
    latitude: 42.36476,
    longitude: -71.10326,
    zoom: 12,
    bearing: 0,
    pitch: 0,
  },
  touchRotate: true,
  controller: true,
  layers: [
    new deck.ScatterplotLayer({
      id: "form-submissions", // layer id
      data, // data formatted as array of objects
      getPosition: (d) => d.coords, // get position from coords
      // Styles
      radiusUnits: "pixels",
      getRadius: 10,
      opacity: 0.7,
      stroked: false,
      filled: true,
      radiusScale: 3,
      getFillColor: [255, 0, 0],
      pickable: true,
      autoHighlight: true,
      highlightColor: [255, 255, 255, 255],
      parameters: {
        depthTest: false,
      },
    }),
  ],
});

function flyToClick(coords) {
  deckgl.setProps({
    initialViewState: {
      longitude: coords[0],
      latitude: coords[1],
      zoom: 17,
      bearing: 20,
      pitch: 20,
      transitionDuration: 750,
      transitionInterpolator: new deck.FlyToInterpolator(),
    },
  });
}

// get current location
// const successCallback = (position) => {
//   // add new point layer of current location to deck gl
//   const layer = new deck.IconLayer({
//     id: "location",
//     data: [
//       {
//         position: [position.coords.longitude, position.coords.latitude],
//       },
//     ],
//     pickable: true,
//     iconAtlas:
//       "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
//     iconMapping: ICON_MAPPING,
//     getIcon: (d) => "marker",
//     sizeScale: 15,
//     getPosition: (d) => d.position,
//     getSize: 10,
//     getColor: [255, 255, 255],
//   });

//   deckgl.setProps({
//     layers: [...deckgl.props.layers, layer],
//   });
// };

// const errorCallback = (error) => {
//   console.log(error);
// };

// // create async function to await for current location and then return the promise as lat long coordinates then resolve the promise
// function getCurrentLocation() {
//   const currentLocation = navigator.geolocation.getCurrentPosition(
//     successCallback,
//     errorCallback
//   );
//   return currentLocation;
// }
// if (navigator.geolocation) {
//   getCurrentLocation();
// }

const ICON_MAPPING = {
  marker: { x: 0, y: 0, width: 128, height: 128, mask: true },
};
const locationButton = document.createElement("div");
// create a button that will request the users location
locationButton.textContent = "Where am I?";
locationButton.id = "location-button";
locationButton.addEventListener("click", () => {
  console.log("yea");
  // when clicked, get the users location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      locationButton.textContent =
        "Where am I? " +
        position.coords.latitude.toFixed(3) +
        ", " +
        position.coords.longitude.toFixed(3);
      // create a deck gl layer for the users location
      const layer = new deck.IconLayer({
        id: "location",
        data: [{ longitude, latitude }],
        pickable: true,
        iconAtlas:
          "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
        iconMapping: ICON_MAPPING,
        getIcon: (d) => "marker",
        sizeScale: 15,
        getPosition: (d) => [d.longitude, d.latitude],
        getSize: 10,
        getColor: [255, 255, 255],
      });
      const keepLayers = deckgl.props.layers[0];

      deckgl.setProps({
        layers: [keepLayers, layer],
      });

      flyToClick([longitude, latitude]);
    });
  }
});
// append the button
document.body.appendChild(locationButton);

// Map to be showed to the user
var map;

// Time interval to update location
var updateTime = 5000;

var target;
var currentLocation;

/**
 * function: initialize
 * Inicializa um novo mapa para ser usado pelo usuário.
 */
function initialize() 
{
  // Initial map
  var mapOptions = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 16
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  // Browser doesn't support Geolocation
  if(navigator.geolocation) geoUpdate();
  else handleNoGeolocation(false);

////////////////////////////// SEARCH BOX /////////////////////////////////
  // Try HTML5 geolocation
  if(navigator.geolocation) 
  {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        console.log("Current position");
        currentLocation = new google.maps.LatLng(
          position.coords.latitude,position.coords.longitude
        );
        var pos = new google.maps.LatLng(
          position.coords.latitude,position.coords.longitude
        );

        var infowindow = new google.maps.InfoWindow({
          map: map,
          position: pos,
          content: 'Location found using HTML5.'
        });

        map.setCenter(pos);
      }, 
      function() {
        handleNoGeolocation(true);
      }
    );
  } 
  else 
  {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }

  ////////////////////////////// SEARCH BOX /////////////////////////////////
  var markers = [];

  // Define search box do Google Maps
  var input     = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);

  /**
   * listener: places_changed
   * Restore the images when receiving the event 'places_changed'.
   */
  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();

    for (var i = 0, marker; marker = markers[i]; i++) {
      marker.setMap(null);
    }

    // For each place, get the icon, place name, and location.
    markers = [];
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
      target = place.geometry.location;

      var image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      var marker = new google.maps.Marker({
        map: map,
        icon: image,
        title: place.name,
        position: place.geometry.location
      });

      markers.push(marker);

      bounds.extend(place.geometry.location);
    }

    map.fitBounds(bounds);
  });

  /**
   * listener: bounds_changed
   * Change the bounds of the map when receives 'bounds_changed'.
   */
  google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
  });

  // Use tail recursion to update position from 5s to 5s
  console.log("Init update:");
  geoUpdateR();
}

/**
 * function: geoUpdate
 * Updates the current position of the user
 */
function geoUpdate()
{
  navigator.geolocation.getCurrentPosition
  (
    function(position) {
      currentLocation = new google.maps.LatLng(
        position.coords.latitude,position.coords.longitude
      );
      var pos = new google.maps.LatLng(
        position.coords.latitude,position.coords.longitude
      );

      var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        content: 'Location found using HTML5.'
      });

      map.setCenter(pos);
    }, 
    function() {
      handleNoGeolocation(true);
    }
  );
}

/**
 * function: geoUpdate
 * Updates the current position of the user
 */
function geoUpdateR()
{
  geoUpdate();
  console.log("Update...");

  if(typeof(currentLocation) == "undefined")
  {
    console.log("UAEHUAHEUAHUEHUAHE");
  }
  var dist = google.maps.geometry.spherical.computeDistanceBetween(currentLocation,currentLocation);
  //console.log(dist);

  setTimeout(geoUpdateR, updateTime);
}

// function distance(location1, location2)
// {
//   var x2 = Math.pow(location1.lat()-location2.lat(),2);
//   var y2 = Math.pow(location1.lng()-location2.lng(),2);
//   return sqrt(x2 + y2);
// }

/**
 * function: handleNoGeolocation
 * Return error to the user if the browser does not support geolocation.
 * @param errorFLag Flag para indicar erro
 */
function handleNoGeolocation(errorFlag) 
{
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}

// Call the function which initializes the map when finish
// loading the browser window.
google.maps.event.addDomListener(window, 'load', initialize);
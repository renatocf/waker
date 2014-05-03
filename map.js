// MAGICAL VARIABLES /////////////////////////////////////////////////
var updateTime  = 5000; // Time interval to update location (ms)
var minimumDist = 1;    // Minimum distance to wake up (km)

// Map to be showed to the user
var map;

// Target location (where you should be waken up)
var target;

// Marker with the current location of the position
var current_marker;

// Distance (in km) between your current position
// and your target position.
var dist;

//var audio = new Audio("metal_gear_game_over.mp3");
var audio;
var canceled = false;
var button_wake;
var button_stop;

/**
 * function: initialize
 * Inicializa um novo mapa para ser usado pelo usuário.
 */
function initialize() 
{
  audio = document.getElementById("audio");
  button_wake = document.getElementById("button_wake");
  button_stop = document.getElementById("button_stop");
  button_canc = document.getElementById("button_canc");
  button_stop.style.display="none";
  button_canc.style.display="none";
  audio.play();
  
  // Initial map
  var mapOptions = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 16
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  // Browser doesn't support Geolocation
  if(navigator.geolocation) geoUpdate();
  else handleNoGeolocation(false);

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
    //for (var i = 0, place; place = places[i]; i++) {
      var place = places[0];
      target = place.geometry.location;
      console.log("UMAUMAUMAE");

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
        title: places.name,
        position: place.geometry.location
      });

      markers.push(marker);

      bounds.extend(place.geometry.location);
    //}

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
  //geoUpdateR();
}

/**
 * function: geoUpdate
 * Updates the current position of the user
 */
function geoUpdate()
{
  navigator.geolocation.getCurrentPosition(
    function(position) 
    {
      var pos = new google.maps.LatLng(
        position.coords.latitude,position.coords.longitude
      );
      
      // If there is a target, calculates the distance 
      // between the target and the current position
      if(typeof(target) != "undefined")
      {
        dist = google.maps.geometry.spherical.computeDistanceBetween(target,pos)/1000;
      }

      if(typeof(current_marker) != "undefined")
        current_marker.setMap(null);

      current_marker = new google.maps.Marker({
        position: pos,
        map: map,
        title: 'Location found using HTML5.'
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
  if(typeof(target) == "undefined")
  {
    document.getElementById('pac-input').focus();
    return;
  }

  geoUpdate();
  console.log("Update...");
  console.log(dist);

  if(canceled) { canceled = false; return; }

  button_stop.style.display="none";
  button_canc.style.display="block";
  button_wake.style.display="none";

  if(dist < minimumDist) 
  {
    wakeUp();
    return;
  }
  setTimeout(geoUpdateR, updateTime);
}

/**
 * function: wakeUp
 * Do the necessary functions to "wake up" the user
 */
function wakeUp()
{
  console.log("WAKE UP");
  button_stop.style.display="block";
  button_canc.style.display="none";
  button_wake.style.display="none";
  audio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
  }, false);
  audio.play();
}

/**
 * function: stop
 * Stop waking up user
 */
function stop()
{
  console.log("stop");
  button_stop.style.display="none";
  button_canc.style.display="none";
  button_wake.style.display="block";
  audio.pause();
  dist = minimumDist;
}

function cancel()
{
  canceled = true;
  console.log("canceling");
  button_stop.style.display="none";
  button_canc.style.display="none";
  button_wake.style.display="block";
  dist = minimumDist;
}

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

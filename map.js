var map;

// Inicializa mapa
function initialize() 
{
  // Mapa inicial
  var mapOptions = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 16
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

////////////////////////////// SEARCH BOX /////////////////////////////////
  // Try HTML5 geolocation
  if(navigator.geolocation) 
  {
    navigator.geolocation.getCurrentPosition(
      function(position) {
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
  var input   = document.getElementById('pac-input');

  //map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);

  var searchBox = new google.maps.places.SearchBox(input);

  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();

    for (var i = 0, marker; marker = markers[i]; i++) {
      marker.setMap(null);
    }

    // For each place, get the icon, place name, and location.
    markers = [];
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
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

  google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
  });
}

// Não suporta geolocalização
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

google.maps.event.addDomListener(window, 'load', initialize);
<!DOCTYPE html>
<html>
  <head>
    <title>Geolocation</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="bootstrap.css" rel="stylesheet" type="text/css">
    <link href="map.css" rel="stylesheet" type="text/css">

    <!-- //////////////////////////////////// API \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ -->
    <!--
    Include the maps javascript with sensor=true because this code is using a
    sensor (a GPS locator) to determine the user's location.
    See: https://developers.google.com/maps/documentation/javascript/tutorial#Loading_the_Maps_API
    -->
    <audio id="audio" src="default.mp3"></audio>
    <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&libraries=places,geometry"></script>
  
    <!-- //////////////////////////////// Our scripts \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ -->
    <script type="text/javascript" src="map.js"></script>
  </head>
  
  <body>
    <!-- /// TOPBAR \\\-->
    <nav class="navbar navbar-inverse" role="navigation">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand" href="#">Waker</a>
        </div>
      </div>
    </nav>
    
    <div class="input-group">
      <span class="input-group-addon"><img src="map-marker.png" height="20" width="20"></span>
      <input id="pac-input" type="text" class="form-control" placeholder="Where are you going?">
    </div>
    
    <div id="map-canvas"></div>
    
    <div id = "button_wake" class="btn btn-lg btn-primary" role="button" onclick="geoUpdateR()" >Wake me!</div>
    <div id = "button_stop" class="btn btn-lg btn-danger"  role="button" onclick="stop()"       >Stop!</div>
    <div id = "button_canc" class="btn btn-lg btn-warning" role="button" onclick="cancel()"     >Cancel</div>
    
    <!-- Bootstrap core JS -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
    <script src="bootstrap.js"></script>
  </body>

</html>
<html>
  <head>
    <title> Chicken Man Example </title>
  </head>
  
  <body>
    <font color="red">My PHP code makes this page say:</font>
    <p>
      <?php
        if (strpos($_SERVER['HTTP_USER_AGENT'], 'Chrome') !== FALSE)
        {
            echo "You are in Google Chrome";
        }
      ?>
    </p>
  </body>
</html>

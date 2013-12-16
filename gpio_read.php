<?php
  // PHP script to read the state of one of the GPIO
  // pins of the PI.  uses the gpio program to read
  // the value
  //
  // inputs   pin Integer the pin number to read
  //
  //
  $pin = strip_tags($_GET["pin"]); 
  exec ("gpio read ".$pin, $result, $return );
  echo( $result[0] );
?>

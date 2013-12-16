<?php

   // PHP script that is called from the egor web page
   // Script will use the installed gpio program to
   // send signals to the GPIO output pins of the PI
   //
   // inputs  pin     Integer-- Pin number to control
   //         status  Integer-- state to put the pin into
   //                 0 = turn the pin off
   //                 1 = turn the pin on
   // 
   if( isset ($_GET["pin"]) && isset($_GET["status"])){
      $pin    = strip_tags($_GET["pin"]);
      $status = strip_tags($_GET["status"]);

      // set pin to output
      system("gpio mode ".$pin." out");

      // set pins status
      system("gpio write ".$pin." ".$status);

      // read status
      exec ("gpio read ".$pin, $status, $return);
      echo ($status[0]);
   }
   else{ echo ("fail");}
?>

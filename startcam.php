<?php

   //
   // PHP script that is called from the egor web page
   //
   //

shell_exec('raspistill -t 999990 -tl 2500 -o tmp/motion/dummy.jpg -w 320 -h 240 -q 5 &');
//   shell_exec("./rcam.sh");
   echo exec('ps -aef | grep raspi'); 
?>

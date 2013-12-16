// 
// JavaScript file that is read when the egor web page is loaded
// Sets up button click listeners and a timer that goes out and
// reads the dummy.jpg file every second
//
//
alert("W E L C O M E     T O     E G O R    C O N T R O L ");
var freeze=0;
var forwardBT  = document.getElementById("forwardBT");
var backwardBT = document.getElementById("backwardBT");
var leftBT     = document.getElementById("leftBT");
var rightBT    = document.getElementById("rightBT");
var panicBT    = document.getElementById("panicBT");
var speakBT    = document.getElementById("speakBT");
var netBT      = document.getElementById("netBT");
var startCamBT = document.getElementById("startCamBT");
var forwardState = document.getElementById("forwardState");
var backwardState=document.getElementById("backwardState");
var leftState=document.getElementById("leftState");
var rightState=document.getElementById("rightState");

var leTime = document.getElementById("leTime").childNodes[0];
var startCam = 0;


forwardBT.addEventListener("click", function(){
   remoteClick(forwardBT,1, forwardState,"images/up_arrow_green.gif","images/blue_up.gif",0);
});
backwardBT.addEventListener("click", function(){
   remoteClick(backwardBT,4, backwardState,"images/up_arrow_green.gif","images/blue_down.gif",0);
});
leftBT.addEventListener("click", function(){
   remoteClick(leftBT,5, leftState,"images/up_arrow_green.gif","images/blue_left.gif",0.2);
});
rightBT.addEventListener("click", function(){
   remoteClick(rightBT,6, rightState,"images/up_arrow_green.gif","images/blue_right.gif",0.2);
});
netBT.addEventListener("click",function(){
   netClick();
});

if( startCamBT )
{
   startCamBT.addEventListener("click",function(){
      startCamBTClick();
   });
}

panicBT.addEventListener("click",function(){
   change_pin(1,0,0);
   change_pin(4,0,0);
   change_pin(5,0,0);
   change_pin(6,0,0);
   forwardBT.alt  ="off";
   forwardBT.src  = "images/blue_up.gif";
   backwardBT.alt ="off";
   backwardBT.src = "images/blue_down.gif";
   leftBT.alt     = "off";
   leftBT.src     = "images/blue_left.gif";
   rightBT.alt    = "off";
   rightBT.src    = "images/blue_right.gif";
});

speakBT.addEventListener("click",function(){
   speak();
});

panicBT.click();


// Start a timer to fire every second
var myVar = setInterval(function(){myTimer()},1000); 

function speak()
{
   alert("Sorry not implemented yet");
}


function netClick()
{
   console.log("netBT clicked!");
   var http = new XMLHttpRequest();
   var randomCrap = Math.random();
   var t1 = new Date().getTime();
   http.open( "GET", "./net_test.php?t=randomCrap",false );
   console.log(t1 + " txing http request...");
   http.send();
   var t2 = new Date().getTime();
   alert("tx at [" + t1 + "]\n rx at [" + t2 + "]\n ...rxd response: [" + http.responseText + 
          "] in [" + (t2-t1)+"] millisecs (" + (t2-t1)/1000 + "secs)");
}
function startCamBTClick()
{
   console.log("startCamBT clicked!");
   if( startCam == 1 )
   {
      alert("Camera already running");
   }
   var http = new XMLHttpRequest();
   http.open("GET", "./startcam.php",false);
   http.send();
   startCam=1;
   console.log("result: " + http.responseText);
}

function gpioReadState(lePin,leElementToUpdate,bt,btOnImg,btOffImg) {
   var request = new XMLHttpRequest();
   request.open( "GET", "./gpio_read.php?pin=" + lePin,false);
   request.send(null);
   var crap =   "[" + request.responseText + "]";
                   // ( "[" + request.readyState + "]" + 
                   // " [" + request.status + 
                   //"] [" + request.responseText + "]"); 
   if( leElementToUpdate)
        leElementToUpdate.innerHTML=crap;
      console.log("DEBUG: state for pin " + lePin + " is: " + crap + " http.readyState: " + request.readyState + " http.status " + request.status);
   
}
function change_pin(pin, status,holdFor)
{
   //alert('new request');
   var request = new XMLHttpRequest();
   request.open( "GET", "gpio.php?pin=" + pin + "&status=" + status,false);
   request.send(null);
   if( holdFor > 0 )
   {
     var x = (new Date().getTime());
     sleep(1000*holdFor);
     var y = (new Date().getTime());
     console.log("awoke " + (y-x));
     request = new XMLHttpRequest();
     request.open( "GET", "gpio.php?pin=" + pin + "&status=" + (status==1?0:1),false);
     request.send(null);
   }
}


function remoteClick (button, pin, stateTF, ongif,offgif,holdFor) {
   if( button.alt === "off"){
      if( holdFor == 0 )
      {
         button.src=ongif;
         button.alt="on";
      }
      change_pin(pin,1,holdFor);
      gpioReadState(pin,stateTF,ongif,offgif);
   }
   else if( button.alt === "on" ) {
      if( holdFor == 0 )
      {
          button.src = offgif;
          button.alt = "off";
      }
      change_pin(pin,0,0);
      gpioReadState(pin,stateTF,ongif,offgif);
   }
}

var ghack=0;
var imgEle=document.getElementById("dummy");
function myTimer()
{
   //console.log(new Date() + " TIMER");
   var startTime = new Date().getTime();
   if( freeze == 1 ) return;

   ghack = ghack+1;
   if( ghack > 20 )
   {
      gpioReadState(1,forwardState, forwardBT, "images/up_arrow_green.gif","images/blue_up.gif");
      gpioReadState(4,backwardState,backwardBT,"images/up_arrow_green.gif","images/blue_down.gif");
      gpioReadState(5,leftState,    leftBT,    "images/up_arrow_green.gif","images/blue_left.gif");
      gpioReadState(6,rightState,   rightBT,   "images/up_arrow_green.gif","images/blue_right.gif");

      ghack = 0;
      logTime("READ GPIO", startTime);
   }

   leTime.nodeValue=new Date();
   if(!document.getElementById("dummy")) return;


   // refresh image file
   imgEle.src = "tmp/motion/dummy.jpg" + "?rand="+(new Date());
   //imgEle.src = "/run/shm/dummy.jpg";
   //imgEle.src = "dummy.php";
   logTime("READ IMG",startTime);
}
function sleep(milliseconds)
{
   freeze=1;
console.log("ms: " + milliseconds);
   var start = new Date().getTime();
   for( var i = 0; i< 1e7; i++ )
   {
      var newTime = new Date().getTime();
      if(( newTime - start) > milliseconds)
      {
         break;
      }
      console.log(newTime-start);
   }
   freeze=0;
}
function logTime( prefix, startTimeMs )
{
   var ms = new Date().getTime() - startTimeMs;
   console.log(  prefix + " took [" + ms + "] ms " +
                  "(" + (ms/1000) + " sec)" );
}

$(document).ready(function() {
 
 // ----------From Google Maps ----------
  var mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(-34.397, 150.644),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

 // ----------Firebase ----------
   var config = {
     apiKey: "AIzaSyDQSJG2BNDwdCddiSGX3OR6drYw5XHKrSY",
     authDomain: "tube-the-earth-44f7e.firebaseapp.com",
     databaseURL: "https://tube-the-earth-44f7e.firebaseio.com",
     projectId: "tube-the-earth-44f7e",
     storageBucket: "tube-the-earth-44f7e.appspot.com",
     messagingSenderId: "978647815700"
   };

   firebase.initializeApp(config);

// Button Test
      object.onclick = function(){fb-test};

      // EventListener
      object.addEventListener("click", fb-test);

      // Modal - stab in dark
      $('#exampleModal').on('shown.bs.modal', function () {
        $('#myInput').trigger('focus')
      })

})



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

   // Matt's code

   $("button").on("click", function() {
     alert("hello world");
     console.log(this);
    $("#videos").html("");
    var location = $(this).attr("data-location");
    var latitude = $("#lat").val().trim();
    var longitude = $("#long").val().trim();
    var radius = $("#rad").val().trim();
    var queryURL = "https://www.googleapis.com/youtube/v3/search?type=video&part=snippet&location=" + latitude + "," + longitude + "&locationRadius=" + radius + "miles&key=AIzaSyC3hyycsztOR8N1flGac1ocYQF1PGt6F6M";

    $.ajax({
    url: queryURL,
    method: "GET"
    })
    
    .then(function(response) {
      var results = response.data;
      console.log(response);
      console.log(response.pageInfo.totalResults);
      if (response.pageInfo.totalResults !== 0) {
        for (var i = 0; i < response.items.length; i++) {             

          console.log(response);
          console.log(response.items[i].id.videoId);
          
          // $("#videoIframe").prepend("<img src=" + response.items[i].snippet.thumbnails.default.url + ">");
          // $("#videoIframe").prepend("<a href='https://www.youtube.com/watch?v=" + response.items[i].id.videoId + "'>youtube link</a>");
          $("#videoIframe").html("<iframe width='420' height='315' src='https://www.youtube.com/embed/" + response.items[0].id.videoId + "' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe>");
        }
      } else {
          alert("no results!");
        };
      });
    });
// Button Test
      object.onclick = function(){fb-test};

      // EventListener
      object.addEventListener("click", fb-test);

      // Modal - stab in dark
      $('#exampleModal').on('shown.bs.modal', function () {
        $('#myInput').trigger('focus')
      })

  });



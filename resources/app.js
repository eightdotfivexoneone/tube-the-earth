      var longi;
      var lati;
  
      function initMap() {
        
        var map = new google.maps.Map(document.getElementById('map-section'), {
          zoom: 8,
          center: {lat: 43.07167, lng: -70.76236}
        });

        var geocoder = new google.maps.Geocoder();
        console.log(map.center);
        google.maps.event.addListener(map, 'click', function(event) {
          placeMarker(event.latLng);
        });

        function placeMarker(location) {
            if (marker == undefined){
                marker = new google.maps.Marker({
                    position: location,
                    map: map, 
                    animation: google.maps.Animation.DROP,
                });
            }
            else{
                marker.setPosition(location);
            }
            map.setCenter(location);
            console.log(location.lat());//this is where latitude is being console logged
            console.log(location.lng());//longitude
        }

        document.getElementById('submit').addEventListener('click', function() {
          geocodeAddress(geocoder, map);
          console.log(geocoder);
          console.log(map);
          console.log(map.center.lat());
          console.log(map.center.lng());
          longi = map.center.lng();
          lati = map.center.lat();
          //debugger;
          // var latitude = $("#lat").val().trim();
          // var longitude = $("#long").val().trim();
          var radius = $("#rad").val().trim();
          var queryURL = "https://www.googleapis.com/youtube/v3/search?type=video&part=snippet&location=" + lati + "," + longi + "&locationRadius=" + radius + "miles&key=AIzaSyC3hyycsztOR8N1flGac1ocYQF1PGt6F6M";
          console.log(lati);
          console.log(longi);
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
                
                $("#cardThumb" + [i]).html("<img class='card-img-top' src=" + response.items[i].snippet.thumbnails.high.url + "> ");
                $("#youtubeLink" + [i]).html("<a href='https://www.youtube.com/watch?v=" + response.items[i].id.videoId + "' class='btn btn-danger' target='_blank'>" + response.items[i].snippet.channelTitle + "</a>");
                $("#youtubeTitle" + [i]).html(response.items[i].snippet.title);
                $("#videoIframe").html("<iframe width='100%' src='https://www.youtube.com/embed/" + response.items[0].id.videoId + "' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe>");
              }
            } else {
                alert("no results!");
              };
            });
          });
      };
      
      console.log(longi);
        
      function geocodeAddress(geocoder, resultsMap) {
        var address = document.getElementById('address').value;
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
              map: resultsMap,
              position: results[0].geometry.location
            });
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
          console.log(address);
          console.log(results[0].geometry.location.lat());
          console.log(results[0].geometry.location.lng());
        });
      }

      var marker;

      function initialize() {
          var latlng = new google.maps.LatLng(42.55308, 9.140625);
          var myOptions = {
              zoom: 2,
              center: latlng,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              streetViewControl: false,
              mapTypeControl: false,
          };
          var map = new google.maps.Map(document.getElementById("map_canvas"),
                  myOptions);
      };

      $("#history").on("click", function() {
        $("#additionalDiv").css("display", "none")
        $("#historyDiv").css("display", "block")
      });
      $("#recently").on("click", function() {
          $("#historyDiv").css("display", "none")
          $("#additionalDiv").css("display", "block")
      });
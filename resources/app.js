// JS for Tube The Earth
const section = document.getElementById("map-section");

var searchTerm = "03801";

section.innerHTML =`
    <iframe class="map" width="100%" height="100%" frameborder="0" style="border:0"
    src="https://www.google.com/maps/embed/v1/search?key=AIzaSyBRjbBXmBByR-YaGaOMs7PAwS4SBmGIqzw&q=${searchTerm}" allowfullscreen>
    </iframe>`

// assign variable to output

// // put listener on button and when clicked do the function
// $('#btn-search').on('click', renderMap(locationMap));

// function renderMap(locationMap){
 
// console.log("greeting from inside the function" + locationMap);

//  // clear out the map that's there
//  UIframe.innerHTML = '';
//  //the stuff we did up top

// UIframe.innerHTML =`
//     <iframe class="map" width="100%" height="100%" frameborder="0" style="border:0"
//     src="https://www.google.com/maps/embed/v1/search?key=AIzaSyBRjbBXmBByR-YaGaOMs7PAwS4SBmGIqzw&q=${locationMap}" allowfullscreen>
//     </iframe>
//                     `
// alert("here");
// // section.appendChild(UIframe);
// // e.preventDefault();
// }

// put listener on button and when clicked do the function
$('#btn-search').click(function renderMap(e) {
  e.preventDefault();
  var locationMap = $("#search-input").val();

 // clear out the map that's there
 section.innerHTML = '';
 //the stuff we did up top

 section.innerHTML =`
    <iframe class="map" width="100%" height="100%" frameborder="0" style="border:0"
    src="http://www.google.com/maps/embed/v1/search?key=AIzaSyBRjbBXmBByR-YaGaOMs7PAwS4SBmGIqzw&q=${locationMap}"allowfullscreen>
    </iframe>`
});

// Matt's code
$("#recently").on("click", function() {
  $("#xyz").css("display", "none")
  $("#recentDiv").css("display", "block")
});
  $("#history").on("click", function() {
    $("#recentDiv").css("display", "none")
    $("#xyz").css("display", "block")
  });

$("#btn-temp").on("click", function() {
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
         
         $("#cardThumb" + [i]).html("<img class='card-img-top' src=" + response.items[i].snippet.thumbnails.high.url + "> ");
         $("#youtubeLink" + [i]).html("<a href='https://www.youtube.com/watch?v=" + response.items[i].id.videoId + "'>" + response.items[i].snippet.channelTitle + "</a>");
         $("#youtubeTitle" + [i]).html(response.items[i].snippet.title);
         $("#videoIframe").html("<iframe width='420' height='315' src='https://www.youtube.com/embed/" + response.items[0].id.videoId + "' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe>");
       }
     } else {
         alert("no results!");
       };
     });
   });


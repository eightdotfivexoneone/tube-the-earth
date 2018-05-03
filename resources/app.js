// JS for Tube The Earth
const section = document.getElementById("map-section");

var searchTerm = "03801";

section.innerHTML =`
    <iframe class="map" width="100%" height="100%" frameborder="0" style="border:0"
    src="https://www.google.com/maps/embed/v1/search?key=AIzaSyBRjbBXmBByR-YaGaOMs7PAwS4SBmGIqzw&q=${searchTerm}" allowfullscreen>
    </iframe>`

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
})


// Dabbling with jQuery UI elements
$(document).ready(() => {

$('.geo-recent-toggle').on('click', () => {
  // Having trouble overriding the slim embed (i think) so I cant seem to swing any slides, toggles, or fades. frustrating.
  // $('.geo-recent').slideToggle('fast');

  $('.firebase').hide();
  $('.geo-recent').show();
});

$('.firebase-toggle').on('click', () => {
  // $('.firebase').fadeToggle(100);
  $('.geo-recent').hide();
  $('.firebase').show();
});

});
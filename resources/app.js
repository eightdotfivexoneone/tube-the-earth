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
})


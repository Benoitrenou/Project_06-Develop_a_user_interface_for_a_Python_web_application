let films = [];

let test = async function (url, index) {
  let response = await fetch(url);
  let data = await response.json();
  let imageUrl = await data.results[index].image_url;
  films.push({src: await imageUrl});
  document.getElementById("movie10").setAttribute("src", imageUrl)
}

let url = 0;
let test2 = function (url, index) {
  fetch (url)
  .then (function(res) {
    if (res.ok) {return res.json();}
  })
  .then (function (value) {
    console.log(value.results[index].image_url);
    let url = value.results[index].image_url;
    console.log(url);
    return url
  })
  .then (function(url) {
    document.getElementById("movie10").setAttribute("src", url)
  })
  .catch (function (err){
    console.log(err)
  })
}

for (i=0; i<5; i++) {
  test ("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score", i);
};
for (i=0; i<2; i++){
  test ("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&page=2", i);
};

console.log(films);

//Classe Movie
class Movie {
  constructor (title, url, year) {
    this.title = title;
    this.url = url;
    this.year = year;
  }
}

// Get the modal
var modal = document.getElementById("modal");

// Get the button that opens the modal
var btn = document.getElementById("button1");

// Get the <span> element that closes the modal
var closeButton = document.getElementById("closeButton");

// When the user clicks the button, open the modal 
let openModal = function (movie_id) {
    modal.style.display = null;
    let element = document.getElementById("BestMovie");
//    getMovieInfos (element.getAttribute('id_api'));
}

// When the user clicks on (x), close the modal
closeButton.onclick = function() {
    modal.style = "display:none";
  }

// When the user clicks anywhere outside of the modal, close it
//window.onclick = function(event) {
//    if (event.target == modal) {
//      modal.style = "display:none";
//    }
//}

const slider = document.querySelector(".slider");
const btnLeft = document.getElementById("moveLeft");
const btnRight = document.getElementById("moveRight");
const indicators = document.querySelectorAll(".indicator");

let baseSliderWidth = slider.offsetWidth;
let activeIndex = 0; // the current page on the slider

let movies = [
  {src:"https://m.media-amazon.com/images/M/MV5BOWVmOWRmMWMtMDc2OC00NGM2LTllOTAtMmY5NjVhM2YzYjVlXkEyXkFqcGdeQXVyOTc2MTgwNjY@._V1_UY268_CR3,0,182,268_AL_.jpg",},
  {src:"https://m.media-amazon.com/images/M/MV5BNjZhYWVhNjktNDRmNS00NGUyLThjZTgtYmU4NmQzYzIyZTk4XkEyXkFqcGdeQXVyMjkxNzQ1NDI@._V1_UY268_CR0,0,182,268_AL_.jpg"},
  {src:"https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=674&q=80",},
  {src:"https://images.unsplash.com/photo-1617182635496-c5c474367085?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",},
  {src:"https://images.unsplash.com/photo-1611419010196-a360856fc42f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80",},
  {src:"https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1267&q=80",},
  {src:"https://images.unsplash.com/photo-1518715303843-586e350765b2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",},
];

console.log(movies);

// Fill the slider with all the movies in the "movies" array
function populateSlider() {
  movies.forEach((image) => {
    // Clone the initial movie thats included in the html, then replace the image with a different one
    const newMovie = document.getElementById("movie0");
    let clone = newMovie.cloneNode(true);
    let img = clone.querySelector("img");
    img.src = image.src;

    slider.insertBefore(clone, slider.childNodes[slider.childNodes.length - 1]);
  });
}

populateSlider();

// delete the initial movie in the html
const initialMovie = document.getElementById("movie0");
initialMovie.remove();

// Update the indicators that show which page we're currently on
function updateIndicators(index) {
  indicators.forEach((indicator) => {
    indicator.classList.remove("active");
  });
  let newActiveIndicator = indicators[index];
  newActiveIndicator.classList.add("active");
}

// Scroll Left button
btnLeft.addEventListener("click", (e) => {
  let movieWidth = document.querySelector(".movie").getBoundingClientRect()
    .width;
  let scrollDistance = movieWidth * 6; // Scroll the length of 6 movies. TODO: make work for mobile because (4 movies/page instead of 6)

  slider.scrollBy({
    top: 0,
    left: -scrollDistance,
    behavior: "smooth",
  });
  activeIndex = (activeIndex - 1) % 3;
  updateIndicators(activeIndex);
});

// Scroll Right button
btnRight.addEventListener("click", (e) => {
  let movieWidth = document.querySelector(".movie").getBoundingClientRect()
    .width;
  let scrollDistance = movieWidth * 6; // Scroll the length of 6 movies. TODO: make work for mobile because (4 movies/page instead of 6)

  // if we're on the last page
  if (activeIndex == 1) {
    // duplicate all the items in the slider (this is how we make 'looping' slider)
    populateSlider();
    slider.scrollBy({
      top: 0,
      left: +scrollDistance,
      behavior: "smooth",
    });
    activeIndex = 0;
    updateIndicators(activeIndex);
  } else {
    slider.scrollBy({
      top: 0,
      left: +scrollDistance,
      behavior: "smooth",
    });
    activeIndex = (activeIndex + 1) % 3;
    updateIndicators(activeIndex);
  }
});
//MAIN MOVIE SECTION
let getMainMovie = function () {
  fetch ("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score")
  .then(function (res){
    if (res.ok) {return res.json();}
  })
  .then (function (value) {
    let imageUrl = value.results[0].image_url;
    let id = value.results[0].id;
    let title = value.results[0].title;
    document.getElementById("bestMovie").setAttribute("src", imageUrl);
    document.getElementById("bestMovie").setAttribute("onClick", "openModal("+id+")");
  })
}
getMainMovie();

//SLIDER SECTION
const slider = document.querySelector(".slider");
const btnLeft = document.getElementById("moveLeft");
const btnRight = document.getElementById("moveRight");
const indicators = document.querySelectorAll(".indicator");

let baseSliderWidth = slider.offsetWidth;
let activeIndex = 0; // the current page on the slider

let films = [];
let getMoviesInfos = async function (url, index) {
  let response = await fetch(url);
  let data = await response.json();
  let imageUrl = await data.results[index].image_url;
  let apiId = await data.results[index].id;
  let movieTitle = await data.results[index].title;
  films.push({src: imageUrl, id:apiId, title:movieTitle});
  return true;
  // return array direct
}

// Fill the slider with all the movies in the "movies" array
function populateSlider(movies) {
  movies.forEach((movie) => {
    // Clone the initial movie thats included in the html, then replace the image with a different one
    const newMovie = document.getElementById("movie0");
    let clone = newMovie.cloneNode(true);
    let img = clone.querySelector("img");
    let h2 = clone.querySelector("h2");
    img.src = movie.src;
    img.setAttribute("onClick", "openModal("+movie.id+")");
    h2.setAttribute("onClick", "openModal("+movie.id+")");
    h2.textContent = movie.title;

    slider.insertBefore(clone, slider.childNodes[slider.childNodes.length - 1]);
  });
}

async function init() {
  for (i=1; i<5; i++) {
    testa = await getMoviesInfos ("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score", i);
  };
  for (i=0; i<3; i++){
    testa = await getMoviesInfos ("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&page=2", i);
  };
  populateSlider(films);
  // delete the initial movie in the html
  const initialMovie = document.getElementById("movie0");
  initialMovie.remove();
  return true;
}

document.getElementsByTagName("body").onload = init();

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
  let scrollDistance = movieWidth * 6; // Scroll the length of 6 movies

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
  let scrollDistance = movieWidth * 6; // Scroll the length of 6 movies

  // if we're on the last page
  if (activeIndex == 1) {
    // duplicate all the items in the slider (this is how we make 'looping' slider)
    populateSlider(films);
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


//MODAL SECTION

//Get movie's detailed informations
let movieDetails = [];
async function getMovieDetails (id) {
  movieDetails.pop();
  let response = await fetch ("http://127.0.0.1:8000/api/v1/titles/"+id);
  let data = await response.json();
  movieDetails.push(data);
  return true;
}

// Get the modal
var modal = document.getElementById("modal");

// Get the button that opens the modal
var btn = document.getElementById("button1");

// Get the <span> element that closes the modal
var closeButton = document.getElementById("closeButton");

// When the user clicks the button, open the modal 
let openModal = async function (movie_id) {
    modal.style.display = null;
    await getMovieDetails(movie_id);
    console.log(movieDetails);
    document.getElementById("modaltitle").textContent = movieDetails[0].title;
    document.getElementById("year").textContent = "Année de sortie : "+movieDetails[0].year;
    document.getElementById("rated").textContent = "Rated : "+movieDetails[0].rated;
    document.getElementById("imdb_score").textContent = "Score IMDB : "+movieDetails[0].imdb_score;
    document.getElementById("directors").textContent = "Réalisateur : "+movieDetails[0].directors;
    document.getElementById("actors").textContent = "Acteurs : "+movieDetails[0].actors;
    document.getElementById("duration").textContent = "Durée du film : "+movieDetails[0].duration+"min";
    document.getElementById("countries").textContent = "Pays d'origine : "+movieDetails[0].countries;
    document.getElementById("income").textContent = "Résultat Box-office : "+movieDetails[0].worldwide_gross_income;
    document.getElementById("description").textContent = "Résumé : "+movieDetails[0].description;
    document.getElementById("genres").textContent = "Genres : "+movieDetails[0].genres;
}

// When the user clicks on (x), close the modal
closeButton.onclick = function() {
    modal.style = "display:none";
  }

//When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
      modal.style = "display:none";
    }
}
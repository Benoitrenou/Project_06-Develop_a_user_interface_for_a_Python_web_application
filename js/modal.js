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


//SLIDER SECTION
const slider = document.querySelector(".slider");
const btnLeft = document.getElementById("moveLeft");
const btnRight = document.getElementById("moveRight");
const indicators = document.querySelectorAll(".indicator");

let baseSliderWidth = slider.offsetWidth;
let activeIndex = 0; // the current page on the slider

//let films = [];
let getMoviesInfos = async function (url, index, array) {
  let response = await fetch(url);
  let data = await response.json();
  for (i=0; i<index; i++) {
    imageUrl = data.results[i].image_url;
    let apiId = data.results[i].id;
    let movieTitle = data.results[i].title;
    array.push({src: imageUrl, id:apiId, title:movieTitle});
  }
  return true;
}

let createSlide = function (sliderId, movies) {
  movies.forEach((movie) => {
    let slider = document.getElementById(sliderId);
    let movieDiv = document.createElement("div");
    movieDiv.setAttribute("class", "movie");
    slider.appendChild(movieDiv);

    let img = document.createElement("img");
    img.setAttribute("src", movie.src);
    img.setAttribute("class", "js-modal");
    img.setAttribute("onClick", "openModal("+movie.id+")");
    movieDiv.appendChild(img);

    let description = document.createElement("div");
    description.setAttribute("class", "description");
    movieDiv.appendChild(description);

    let descriptionTitle = document.createElement("div");
    descriptionTitle.setAttribute("class", "description_title");
    description.appendChild(descriptionTitle);

    let title = document.createElement("h2");
    descriptionTitle.appendChild(title);
    title.setAttribute("onClick", "openModal("+movie.id+")");
    title.setAttribute("class", "js-modal");
    title.textContent = movie.title;
  })
  return true;
}

let loadBestsSlider = async function () {
  let bestsArray = [];
  await getMoviesInfos ("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score", 5, bestsArray);
  await getMoviesInfos ("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&page=2", 3, bestsArray);
  bestsArray.splice(0, 1);
  createSlide("bestMoviesSlider", bestsArray);
}

let loadCategSlider = async function(slider, genre) {
  let categArray = [];
  await getMoviesInfos ("http://127.0.0.1:8000/api/v1/titles/?genre="+genre+"&sort_by=-imdb_score", 5, categArray);
  await getMoviesInfos ("http://127.0.0.1:8000/api/v1/titles/?genre="+genre+"&sort_by=-imdb_score&page=2", 2, categArray);
  createSlide(slider, categArray);
}

async function init() {
  getMainMovie();
  loadBestsSlider();
  loadCategSlider("categ1Slider", "Western");
  loadCategSlider("categ2Slider", "Fantasy");
  loadCategSlider("categ3Slider", "Thriller");
  return true;
}

document.getElementsByTagName("body").onload = init();

// Update the indicators that show which page we're currently on
function updateIndicators(index) {
  indicators.forEach((indicator) => {
    indicator.classList.remove("active");
  });
  console.log(indicators);
  let newActiveIndicator = indicators[index];
  newActiveIndicator.classList.add("active");
}

// Scroll Left button
const scrollLeft = function() {
  let movieWidth = document.querySelector(".movie").getBoundingClientRect()
    .width;
  let scrollDistance = movieWidth * 6; // Scroll the length of 6 movies
  slider.scrollBy({
    top: 0,
    left: -scrollDistance,
    behavior: "smooth",
  });
  //activeIndex = (activeIndex - 1) % 1;
  switch(activeIndex) {
    case 0:
      activeIndex=1;
      break;
    case 1:
      activeIndex=0;
      break;
    default:
      activeIndex=0;
  }
  updateIndicators(activeIndex);
}

// Scroll Right button
const scrollRight = function() {
  let movieWidth = document.querySelector(".movie").getBoundingClientRect()
    .width;
  let scrollDistance = movieWidth * 6; // Scroll the length of 6 movies

  // if we're on the last page
  if (activeIndex == 1) {
    createSlide("bestMoviesSlider", bestsArray);
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
}

btnRight.addEventListener("click", (e) => {
  scrollRight();  
});

btnLeft.addEventListener("click", (e) => {
  scrollLeft();
});


//MODAL SECTION

//Get movie's detailed informations
async function getMovieDetails (id) {
  let response = await fetch ("http://127.0.0.1:8000/api/v1/titles/"+id);
  let data = await response.json();
  return await data;
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
    let movie = await getMovieDetails(movie_id);
    document.getElementById("modaltitle").textContent = movie.title;
    let img = document.getElementById("modalImage");
    img.setAttribute("src", movie.image_url);
    document.getElementById("year").textContent = "Année de sortie : "+movie.year;
    document.getElementById("rated").textContent = "Rated : "+movie.rated;
    document.getElementById("imdb_score").textContent = "Score IMDB : "+movie.imdb_score;
    document.getElementById("directors").textContent = "Réalisateur : "+movie.directors;
    document.getElementById("actors").textContent = "Acteurs : "+movie.actors;
    document.getElementById("duration").textContent = "Durée du film : "+movie.duration+"min";
    document.getElementById("countries").textContent = "Pays d'origine : "+movie.countries;
    document.getElementById("income").textContent = "Résultat Box-office : "+movie.worldwide_gross_income;
    document.getElementById("description").textContent = "Résumé : "+movie.description;
    document.getElementById("genres").textContent = "Genres : "+movie.genres;
}

// When the user clicks on (x), close the modal
closeButton.onclick = function() {
    modal.style = "display:none"
  }

//When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
      modal.style = "display:none";
    }
}


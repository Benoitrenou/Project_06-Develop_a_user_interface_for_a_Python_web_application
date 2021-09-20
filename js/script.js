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
    let note = value.results[0].imdb_score;
    document.getElementById("bestMovie").setAttribute("src", imageUrl);
    document.getElementById("bestMovie").setAttribute("onClick", "openModal("+id+")");
    document.getElementById("besttitle").setAttribute("onClick", "openModal("+id+")");
    document.getElementById("besttitle").textContent = title;
    document.getElementById("bestnote").textContent = "Note IMDB : "+note;
    document.getElementById("bestinfos").setAttribute("onClick", "openModal("+id+")")
  })
}


//SLIDER SECTION

//Define indicators for scrolling method
const indicators0 = document.querySelectorAll(".indic0");
const indicators1 = document.querySelectorAll(".indic1");
const indicators2 = document.querySelectorAll(".indic2");
const indicators3 = document.querySelectorAll(".indic3");


//let baseSliderWidth = slider.offsetWidth;
let activeIndex = 0; // the current page on the slider

// Update the indicators that show which page we're currently on
function updateIndicators(index, indicators) {
  indicators.forEach((indicator) => {
    indicator.classList.remove("active");
  });
  let newActiveIndicator = indicators[index];
  newActiveIndicator.classList.add("active");
}

// Scroll Left button function
const scrollLeft = function(slider, indicators) {
  let movieWidth = document.querySelector(".movie").getBoundingClientRect()
    .width;
  let scrollDistance = movieWidth * 2; // Scroll the length of 6 movies
  slider.scrollBy({
    top: 0,
    left: -scrollDistance,
    behavior: "smooth",
  });
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
  updateIndicators(activeIndex, indicators);
}

// Scroll Right button function
const scrollRight = function(slider, sliderId, array, indicators) {
  let movieWidth = document.querySelector(".movie").getBoundingClientRect()
    .width;
  let scrollDistance = movieWidth * 2; // Scroll the length of 6 movies

  // if we're on the last page
  if (activeIndex == 1) {
    createSlide(sliderId, array);
    slider.scrollBy({
      top: 0,
      left: +scrollDistance,
      behavior: "smooth",
    });
    activeIndex = 0;
    updateIndicators(activeIndex, indicators);
  } else {
    slider.scrollBy({
      top: 0,
      left: +scrollDistance,
      behavior: "smooth",
    });
    activeIndex = (activeIndex + 1) % 3;
    updateIndicators(activeIndex, indicators);
  }
}

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
  let btnLeft = document.getElementById("moveLeft0");
  let btnRight = document.getElementById("moveRight0");
  let slider = document.getElementById("bestMoviesSlider")
  btnRight.addEventListener("click", (e) => {
    scrollRight(slider, "bestMoviesSlider", bestsArray, indicators0);  
  });
  btnLeft.addEventListener("click", (e) => {
    scrollLeft(slider, indicators0);
  });
  return true
}

let loadCategSlider = async function(number, sliderid, genre, indicators) {
  let categArray = [];
  await getMoviesInfos ("http://127.0.0.1:8000/api/v1/titles/?genre="+genre+"&sort_by=-imdb_score", 5, categArray);
  await getMoviesInfos ("http://127.0.0.1:8000/api/v1/titles/?genre="+genre+"&sort_by=-imdb_score&page=2", 2, categArray);
  createSlide(sliderid, categArray);
  let btnLeft = document.getElementById("moveLeft"+number);
  let btnRight = document.getElementById("moveRight"+number);
  let slider = document.getElementById(sliderid)
  btnRight.addEventListener("click", (e) => {
    scrollRight(slider, sliderid, categArray, indicators);  
  });
  btnLeft.addEventListener("click", (e) => {
    scrollLeft(slider, indicators);
  return true
})
}

async function init() {
  getMainMovie();
  loadBestsSlider();
  loadCategSlider(1, "categ1Slider", "Western", indicators1);
  loadCategSlider(2, "categ2Slider", "History", indicators2);
  loadCategSlider(3, "categ3Slider", "Thriller", indicators3);
  return true;
}

document.getElementsByTagName("body").onload = init();

//MODAL SECTION
//Get movie's detailed informations
async function getMovieDetails (id) {
  let response = await fetch ("http://127.0.0.1:8000/api/v1/titles/"+id);
  let data = await response.json();
  return await data;
}

// Get the modal and close button
var modal = document.getElementById("modal");
var closeButton = document.getElementById("closeButton");

// When the user clicks the button, open the modal 
let openModal = async function (movie_id) {
    modal.style.display = null;
    //document.body.style.overflowY = "hidden";    
    let movie = await getMovieDetails(movie_id);
    document.getElementById("modaltitle").textContent = movie.title;
    let img = document.getElementById("modalImage");
    img.setAttribute("src", movie.image_url);
    document.getElementById("genres").textContent = "Genres : "+movie.genres;
    document.getElementById("year").textContent = "Année de sortie : "+movie.year;
    if (movie.rated = "Not rated or unkown rating") {
      document.getElementById("rated").textContent = "Rated : -" 
    } else {
      document.getElementById("rated").textContent = "Rated : "+movie.rated;}
    document.getElementById("imdb_score").textContent = "Score IMDB : "+movie.imdb_score;
    document.getElementById("directors").textContent = "Réalisateur : "+movie.directors;
    document.getElementById("actors").textContent = "Acteurs : "+movie.actors;
    document.getElementById("duration").textContent = "Durée du film : "+movie.duration+"min";
    document.getElementById("countries").textContent = "Pays d'origine : "+movie.countries;
    if (!movie.worldwide_gross_income) {
      document.getElementById("income").textContent = "Résultat Box-office : -"
    } else {
      document.getElementById("income").textContent = "Résultat Box-office : "+movie.worldwide_gross_income+" $";}
    document.getElementById("description").textContent = "Résumé : "+movie.description;
}

// When the user clicks on (x), close the modal
closeButton.onclick = function() {
    modal.style = "display:none";
  }

//When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
      modal.style = "disaply:none";
    }
}


// Get the modal
var modal = document.getElementById("modal");

// Get the button that opens the modal
var btn = document.getElementById("button1");

// Get the <span> element that closes the modal
var closeButton = document.getElementById("closeButton");

// When the user clicks the button, open the modal 
const openModal = function (movie_id) {
    modal.style.display = null;
    document.getElementById('Anneedesortie').innerHTML="Coucou";
}

// When the user clicks on (x), close the modal
closeButton.onclick = function() {
    modal.style = "display:none";
  }

  // When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
      modal.style = "display:none";
    }
  }
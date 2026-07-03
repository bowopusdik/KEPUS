// BUKA MODAL
function openModal() {
  document.getElementById("spjModal").style.display = "flex";
}

// TUTUP MODAL
function closeModal() {
  document.getElementById("spjModal").style.display = "none";
}

// KLIK DI LUAR MODAL UNTUK TUTUP
window.onclick = function(event) {
  let modal = document.getElementById("spjModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

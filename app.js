let currentFiles = [];

/* OPEN MODAL */
function openModal(spm, total, drpp, spby, kw, st) {

  currentFiles = [
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  ];

  document.getElementById("spjModal").style.display = "flex";

  document.getElementById("modalTitle").innerText =
    "📊 DETAIL " + spm;

  document.getElementById("modalBody").innerHTML = `
    <p><b>💰 Total:</b> Rp ${total}</p>
    <p><b>📄 DRPP:</b> ${drpp.join(", ")}</p>
    <p><b>💳 SPBY:</b> ${spby}</p>
    <p><b>🧾 KW:</b> ${kw}</p>
    <p><b>📌 ST:</b> ${st.join(", ")}</p>

    <hr>

    <h4>📎 FILE SPJ</h4>
    <ul>
      <li>spj_1.pdf</li>
    </ul>
  `;
}

/* CLOSE MODAL */
function closeModal() {
  document.getElementById("spjModal").style.display = "none";
}

/* CLICK OUTSIDE */
window.onclick = function(e){
  let modal = document.getElementById("spjModal");
  if(e.target == modal){
    closeModal();
  }
}

/* PREVIEW */
function previewFile(){
  window.open(currentFiles[0], "_blank");
}

/* DOWNLOAD */
function downloadZIP(){
  alert("Download dimulai...");
}

/* 🔍 REAL TIME SEARCH */
function searchTable() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let rows = document.querySelectorAll("table tbody tr");

  rows.forEach(row => {
    let text = row.innerText.toLowerCase();
    row.style.display = text.includes(input) ? "" : "none";
  });
}

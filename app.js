
let currentFiles = [];

// OPEN MODAL
function openModal(spm, total, drpp, spby, kw, st) {

  currentFiles = [
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  ];

  document.getElementById("spjModal").style.display = "flex";

  document.getElementById("modalTitle").innerText =
    "📊 DETAIL " + spm;

  document.getElementById("modalBody").innerHTML = `
    <p><b>💰 Total:</b> Rp ${total}</p>
    <p><b>📄 DRPP:</b> ${drpp}</p>
    <p><b>💳 SPBY:</b> ${spby}</p>
    <p><b>🧾 KWITANSI:</b> ${kw}</p>
    <p><b>📌 SURAT TUGAS:</b> ${st}</p>
  `;
}

// CLOSE MODAL
function closeModal() {
  document.getElementById("spjModal").style.display = "none";
}

// CLICK OUTSIDE
window.onclick = function(e) {
  if (e.target == document.getElementById("spjModal")) {
    closeModal();
  }
}

// PREVIEW
function previewFile() {
  window.open(currentFiles[0], "_blank");
}

// DOWNLOAD ZIP SIMULASI
function downloadZIP() {
  alert("📦 Download SPJ dimulai...");
  currentFiles.forEach((f, i) => {
    setTimeout(() => {
      let a = document.createElement("a");
      a.href = f;
      a.download = "spj-" + i + ".pdf";
      a.click();
    }, i * 500);
  });
}

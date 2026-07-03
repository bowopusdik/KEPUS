
let currentFiles = [];

// OPEN MODAL DINAMIS (FIXED)
function openModal(spm, total, drpp, spby, kwitansi, st) {

  currentFiles = [
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    "https://www.orimi.com/pdf-test.pdf"
  ];

  document.getElementById("modalTitle").innerText =
    "📊 DETAIL SPJ - " + spm;

  document.getElementById("modalBody").innerHTML = `
    <p><b>💰 Total:</b> Rp ${total}</p>
    <p><b>📄 DRPP:</b> ${Array.isArray(drpp) ? drpp.join(", ") : drpp}</p>
    <p><b>💳 SPBY:</b> ${spby}</p>
    <p><b>🧾 KWITANSI:</b> ${kwitansi}</p>
    <p><b>📌 SURAT TUGAS:</b> ${Array.isArray(st) ? st.join(", ") : st}</p>

    <hr>

    <h4>📎 FILE SPJ</h4>
    <ul>
      ${currentFiles.map((f, i) => `<li>✔ File ${i+1}</li>`).join("")}
    </ul>
  `;

  document.getElementById("spjModal").style.display = "flex";
}

// CLOSE MODAL
function closeModal() {
  document.getElementById("spjModal").style.display = "none";
}

// CLICK OUTSIDE MODAL
window.onclick = function(e) {
  let modal = document.getElementById("spjModal");
  if (e.target === modal) {
    closeModal();
  }
}

// PREVIEW FILE
function previewFile() {
  window.open(currentFiles[0], "_blank");
}

// DOWNLOAD ZIP (SIMULASI)
function downloadZIP() {
  alert("📦 Download SPJ dimulai...");

  currentFiles.forEach((file, i) => {
    let a = document.createElement("a");
    a.href = file;
    a.download = "SPJ-file-" + (i + 1) + ".pdf";
    a.click();
  });
}

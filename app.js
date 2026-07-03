let currentFiles = [];

// OPEN MODAL DINAMIS
function openModal(spm, total, drpp, spby, kwitansi, st) {

  currentFiles = [
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    "https://www.orimi.com/pdf-test.pdf"
  ];

  document.getElementById("modalTitle").innerText =
    "📊 DETAIL SPJ - " + spm;

  document.getElementById("modalBody").innerHTML = `
    <p><b>💰 Total:</b> Rp ${total}</p>
    <p><b>📄 DRPP:</b> ${drpp.join(", ")}</p>
    <p><b>💳 SPBY:</b> ${spby}</p>
    <p><b>🧾 KWITANSI:</b> ${kwitansi}</p>
    <p><b>📌 SURAT TUGAS:</b> ${st.join(", ")}</p>

    <hr>

    <h4>📎 FILE SPJ</h4>
    <ul>
      <li>✔ spj_1.pdf</li>
      <li>✔ spj_2.pdf</li>
    </ul>

    <div class="modal-actions">
      <button class="btn-blue" onclick="previewFile()">👁 Preview</button>
      <button class="btn-green" onclick="downloadZIP()">⬇ Download ZIP</button>
    </div>
  `;

  document.getElementById("spjModal").style.display = "flex";
}

// CLOSE MODAL
function closeModal() {
  document.getElementById("spjModal").style.display = "none";
}

// CLICK OUTSIDE
window.onclick = function(e) {
  let modal = document.getElementById("spjModal");
  if (e.target == modal) modal.style.display = "none";
}

// PREVIEW FILE
function previewFile() {
  window.open(currentFiles[0], "_blank");
}

// DOWNLOAD SIMULASI ZIP
function downloadZIP() {
  alert("📦 Download dimulai...");

  currentFiles.forEach((file, i) => {
    setTimeout(() => {
      let a = document.createElement("a");
      a.href = file;
      a.download = "SPJ-file-" + i + ".pdf";
      a.click();
    }, i * 500);
  });
}

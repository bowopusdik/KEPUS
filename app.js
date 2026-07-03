
// DATA CONTOH FILE SPJ
const spjData = {
  spm: "SPM-001/2026",
  total: "Rp 5.000.000",
  drpp: ["DRPP-01", "DRPP-02"],
  spby: "SPBY-01",
  kwitansi: "KW-01",
  st: ["ST-01", "ST-02"],
  files: [
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    "https://www.orimi.com/pdf-test.pdf"
  ]
};


// BUKA MODAL
function openModal() {

  // isi data ke modal
  document.querySelector(".modal-content h2").innerText =
    "📊 DETAIL SPJ - " + spjData.spm;

  document.querySelector(".modal-body").innerHTML = `
    <p><b>💰 Total SPM:</b> ${spjData.total}</p>
    <p><b>📄 DRPP:</b> ${spjData.drpp.join(", ")}</p>
    <p><b>💳 SPBY:</b> ${spjData.spby}</p>
    <p><b>🧾 KWITANSI:</b> ${spjData.kwitansi}</p>
    <p><b>📌 SURAT TUGAS:</b> ${spjData.st.join(", ")}</p>

    <hr>

    <h4>📎 FILE SPJ</h4>
    <ul>
      ${spjData.files.map((f, i) =>
        `<li>✔ File ${i+1}</li>`
      ).join("")}
    </ul>

    <div class="modal-actions">
      <button class="btn-blue" onclick="previewFile()">👁 Preview</button>
      <button class="btn-green" onclick="downloadZIP()">⬇ Download ZIP</button>
    </div>
  `;

  document.getElementById("spjModal").style.display = "flex";
}


// TUTUP MODAL
function closeModal() {
  document.getElementById("spjModal").style.display = "none";
}


// KLIK LUAR MODAL
window.onclick = function(event) {
  let modal = document.getElementById("spjModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


// 👁 PREVIEW FILE
function previewFile() {
  window.open(spjData.files[0], "_blank");
}


// ⬇ DOWNLOAD ZIP (SIMULASI)
function downloadZIP() {
  alert("📦 Download ZIP dimulai... (demo)");

  // simulasi download file satu per satu
  spjData.files.forEach((file, i) => {
    setTimeout(() => {
      const a = document.createElement("a");
      a.href = file;
      a.download = "spj-file-" + (i+1) + ".pdf";
      a.click();
    }, i * 500);
  });
}

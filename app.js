let currentFiles = [];

/* =========================
   OPEN MODAL (VIEW SPJ)
========================= */
function openModal(spm, total, drpp, spby, kwitansi, st) {

  // dummy file (nanti bisa diganti upload real)
  currentFiles = [
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    "https://www.orimi.com/pdf-test.pdf"
  ];

  // set judul modal
  document.getElementById("modalTitle").innerText =
    "📊 DETAIL SPJ - " + spm;

  // isi data modal
  document.getElementById("modalBody").innerHTML = `
    <p><b>💰 Total:</b> Rp ${total}</p>
    <p><b>📄 DRPP:</b> ${Array.isArray(drpp) ? drpp.join(", ") : drpp}</p>
    <p><b>💳 SPBY:</b> ${spby}</p>
    <p><b>🧾 KWITANSI:</b> ${kwitansi}</p>
    <p><b>📌 SURAT TUGAS:</b> ${Array.isArray(st) ? st.join(", ") : st}</p>

    <hr>

    <h4>📎 FILE SPJ</h4>
    <ul>
      ${currentFiles.map((f, i) => `<li>✔ File SPJ ${i + 1}</li>`).join("")}
    </ul>
  `;

  // tampilkan modal
  document.getElementById("spjModal").style.display = "flex";
}

/* =========================
   CLOSE MODAL
========================= */
function closeModal() {
  document.getElementById("spjModal").style.display = "none";
}

/* =========================
   CLICK OUTSIDE MODAL
========================= */
window.addEventListener("click", function (e) {
  const modal = document.getElementById("spjModal");
  if (e.target === modal) {
    closeModal();
  }
});

/* =========================
   PREVIEW FILE
========================= */
function previewFile() {
  if (currentFiles.length > 0) {
    window.open(currentFiles[0], "_blank");
  } else {
    alert("Tidak ada file");
  }
}

/* =========================
   DOWNLOAD (SIMULASI ZIP)
========================= */
function downloadZIP() {
  alert("📦 Download SPJ dimulai...");

  currentFiles.forEach((file, i) => {
    setTimeout(() => {
      const a = document.createElement("a");
      a.href = file;
      a.download = "SPJ-file-" + (i + 1) + ".pdf";
      a.click();
    }, i * 400);
  });
}

/*====================================================
    MONITORING SPJ SATKER
    dashboard.js
    BAGIAN 1
====================================================*/

/*====================================================
    GOOGLE APPS SCRIPT
====================================================*/

const API_URL =
    "https://script.google.com/macros/s/AKfycbxD2LU3sdIno_YmDGEh5HhTlOs48WpvxQSZUS5RQwdw_1vW5PDn6W9pNiALq7eYg8E3/exec";

/*====================================================
    USER LOGIN
====================================================*/

let currentUser = {
    nama: "Administrator",
    role: "admin"
};

/*====================================================
    GLOBAL VARIABLE
====================================================*/

let dataSPM = [];

let keyword = "";

let filterStatus = "";

let filterTahun = "";

let filterBulan = "";

let currentUpload = {
    spm: null,
    drpp: null,
    spby: null
};

/*====================================================
    INITIALIZE
====================================================*/

document.addEventListener("DOMContentLoaded", init);

async function init() {

    registerEvent();

    await loadData();

}

/*====================================================
    REGISTER EVENT
====================================================*/

function registerEvent() {

    // Search
    const txtSearch = document.getElementById("searchSPM");

    if (txtSearch) {

        txtSearch.addEventListener("keyup", function () {

            keyword = this.value.trim().toLowerCase();

            renderDashboard();

        });

    }

    // Tombol Tambah SPM
    const btnTambah = document.getElementById("btnTambahSPM");

    if (btnTambah) {

        btnTambah.addEventListener("click", bukaModalSPM);

    }

    // Tombol Simpan SPM
    const btnSimpan = document.getElementById("btnSimpanSPM");

    if (btnSimpan) {

        btnSimpan.addEventListener("click", simpanSPM);

    }

    // Tombol Upload PDF
    const btnUpload = document.getElementById("btnUpload");

    if (btnUpload) {

        btnUpload.addEventListener("click", prosesUploadPDF);

    }

}

/*====================================================
    LOAD DATA
====================================================*/

async function loadData() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {

            throw new Error("HTTP Error : " + response.status);

        }

        const result = await response.json();

        console.log("Response API :", result);

        if (!result.success) {

            alert("Gagal mengambil data dari Google Spreadsheet.");

            return;

        }

        dataSPM = result.data || [];

        updateStatistic();

        renderDashboard();

    }

    catch (error) {

        console.error(error);

        alert("Tidak dapat terhubung ke Google Apps Script.");

    }

}

/*====================================================
    REFRESH DATA
====================================================*/

async function refreshData() {

    await loadData();

}

/*====================================================
    SIMPAN DATA
====================================================*/

async function saveData() {

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(dataSPM)

        });

        const result = await response.json();

        console.log(result);

        if (!result.success) {

            alert("Gagal menyimpan data.");

            return false;

        }

        return true;

    }

    catch (error) {

        console.error(error);

        alert("Tidak dapat menyimpan data.");

        return false;

    }

}

/*====================================================
    FORMAT RUPIAH
====================================================*/

function rupiah(nilai = 0) {

    return Number(nilai).toLocaleString("id-ID", {

        style: "currency",

        currency: "IDR"

    });

}

/*====================================================
    BADGE STATUS
====================================================*/

function badgeStatus(status = "") {

    switch (status.toLowerCase()) {

        case "selesai":
            return "success";

        case "revisi":
            return "warning";

        case "menunggu":

        case "menunggu verifikasi":
            return "info";

        case "belum":

        case "belum upload":

        case "belum menyerahkan":
            return "danger";

        default:
            return "secondary";

    }

}

/*====================================================
    JUMLAH DRPP
====================================================*/

function jumlahDRPP(spm) {

    return spm?.drpp?.length || 0;

}

/*====================================================
    JUMLAH SPBY
====================================================*/

function jumlahSPBY(spm) {

    if (!spm?.drpp) return 0;

    let total = 0;

    spm.drpp.forEach(drpp => {

        total += drpp?.spby?.length || 0;

    });

    return total;

}

/*====================================================
    PROSES UPLOAD PDF
====================================================*/

async function prosesUploadPDF() {

    const file = document.getElementById("filePDF")?.files[0];

    if (!file) {

        alert("Pilih file PDF.");

        return;

    }

    // Upload Google Drive
    alert("Tahap berikutnya file akan dikirim ke Google Drive.");

}
/*====================================================
    RENDER DASHBOARD
====================================================*/

function renderDashboard() {

    const tbody = document.getElementById("tableSPM");

    if (!tbody) return;

    tbody.innerHTML = "";

    if (dataSPM.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="text-center text-muted">
                    Belum ada data SPM
                </td>
            </tr>
        `;

        return;
    }

    let hasil = dataSPM.filter(item => {

        if (keyword !== "") {

            if (!item.nomor.toLowerCase().includes(keyword)) {
                return false;
            }

        }

        if (filterStatus !== "") {

            if ((item.status || "").toLowerCase() !== filterStatus.toLowerCase()) {
                return false;
            }

        }

        if (filterTahun !== "") {

            if (!item.tanggal?.startsWith(filterTahun)) {
                return false;
            }

        }

        if (filterBulan !== "") {

            const bulan = item.tanggal?.split("-")[1];

            if (bulan !== filterBulan) {
                return false;
            }

        }

        return true;

    });

    if (hasil.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="text-center text-muted">
                    Data tidak ditemukan
                </td>
            </tr>
        `;

        return;

    }

    hasil.forEach((spm, index) => {

        tbody.insertAdjacentHTML(
            "beforeend",
            renderSPM(spm, index)
        );

    });

}

/*====================================================
    RENDER SPM
====================================================*/

function renderSPM(spm, index) {

    return `

<tr>

    <td>

        <button
            class="btn btn-outline-primary btn-sm"
            onclick="toggleSPM(${index})">

            <i class="fa-solid fa-eye"></i>

        </button>

    </td>

    <td>${index + 1}</td>

    <td>

        <strong>${spm.nomor}</strong>

    </td>

    <td>

        ${rupiah(spm.total)}

    </td>

    <td>

        ${jumlahDRPP(spm)}

    </td>

    <td>

        ${jumlahSPBY(spm)}

    </td>

    <td>

        <span class="badge bg-${badgeStatus(spm.status)}">

            ${spm.status}

        </span>

    </td>

    <td>

        <button class="btn btn-primary btn-sm">

            <i class="fa fa-upload"></i>

        </button>

    </td>

    <td>

        <button class="btn btn-info btn-sm">

            <i class="fa fa-file-pdf"></i>

        </button>

    </td>

    <td>

        <button class="btn btn-success btn-sm">

            <i class="fa fa-download"></i>

        </button>

    </td>

</tr>

<tr
    id="detail-${index}"
    style="display:none;">

    <td colspan="10">

        <div id="isi-detail-${index}"></div>

    </td>

</tr>

`;

}

/*====================================================
    TOGGLE DETAIL SPM
====================================================*/

function toggleSPM(index) {

    const row = document.getElementById(`detail-${index}`);

    const isi = document.getElementById(`isi-detail-${index}`);

    if (row.style.display === "none") {

        row.style.display = "";

        isi.innerHTML = renderDRPP(index);

    } else {

        row.style.display = "none";

    }

}

/*====================================================
    RENDER DRPP
====================================================*/

function renderDRPP(index) {

    const spm = dataSPM[index];

    if (!spm.drpp || spm.drpp.length === 0) {

        return `
            <div class="alert alert-warning mb-0">
                Belum ada data DRPP
            </div>
        `;

    }

    let html = `

<table class="table table-bordered table-sm">

<thead class="table-light">

<tr>

<th width="60"></th>

<th>Nomor DRPP</th>

<th>Total</th>

<th>Status</th>

<th width="180">Aksi</th>

</tr>

</thead>

<tbody>

`;

    spm.drpp.forEach((drpp, i) => {

        html += renderBarisDRPP(index, i, drpp);

    });

    html += `

</tbody>

</table>

`;

    return html;

}

/*====================================================
    BARIS DRPP
====================================================*/

function renderBarisDRPP(indexSPM, indexDRPP, drpp) {

    return `

<tr>

<td>

<button
class="btn btn-outline-secondary btn-sm"
onclick="toggleDRPP(${indexSPM},${indexDRPP})">

<i class="fa-solid fa-folder-open"></i>

</button>

</td>

<td>

<strong>${drpp.nomor}</strong>

</td>

<td>

${rupiah(drpp.total)}

</td>

<td>

<span class="badge bg-${badgeStatus(drpp.status)}">

${drpp.status}

</span>

</td>

<td>

<button class="btn btn-primary btn-sm">

<i class="fa-solid fa-plus"></i>

Tambah SPBy

</button>

</td>

</tr>

<tr
id="detail-drpp-${indexSPM}-${indexDRPP}"
style="display:none;">

<td colspan="5">

<div id="isi-drpp-${indexSPM}-${indexDRPP}"></div>

</td>

</tr>

`;

}

/*====================================================
    TOGGLE DRPP
====================================================*/

function toggleDRPP(indexSPM, indexDRPP) {

    const row = document.getElementById(
        `detail-drpp-${indexSPM}-${indexDRPP}`
    );

    const isi = document.getElementById(
        `isi-drpp-${indexSPM}-${indexDRPP}`
    );

    if (row.style.display === "none") {

        row.style.display = "";

        isi.innerHTML = renderSPBY(
            indexSPM,
            indexDRPP
        );

    } else {

        row.style.display = "none";

    }

}

/*====================================================
    RENDER SPBY
====================================================*/

function renderSPBY(indexSPM, indexDRPP) {

    const drpp = dataSPM[indexSPM].drpp[indexDRPP];

    if (!drpp.spby || drpp.spby.length === 0) {

        return `
            <div class="alert alert-warning mb-0">
                Belum ada data SPBy
            </div>
        `;

    }

    let html = `

<table class="table table-striped table-hover table-sm">

    <thead class="table-success">

        <tr>

            <th>No</th>

            <th>Nomor SPBy</th>

            <th>Kwitansi</th>

            <th>Surat Tugas</th>

            <th>Status</th>

            <th>Upload</th>

            <th>View</th>

            <th>Download</th>

        </tr>

    </thead>

    <tbody>

`;

    drpp.spby.forEach((spby, indexSPBY) => {

        html += renderBarisSPBY(
            indexSPM,
            indexDRPP,
            indexSPBY,
            spby
        );

    });

    html += `

    </tbody>

</table>

`;

    return html;

}

/*====================================================
    BARIS SPBY
====================================================*/

function renderBarisSPBY(indexSPM, indexDRPP, indexSPBY, spby) {

    return `

<tr>

    <td>${indexSPBY + 1}</td>

    <td>

        <strong>${spby.nomor || "-"}</strong>

    </td>

    <td>

        ${spby.kwitansi || "-"}

    </td>

    <td>

        ${spby.surat_tugas || "-"}

    </td>

    <td>

        <span class="badge bg-${badgeStatus(spby.status)}">

            ${spby.status || "Belum"}

        </span>

    </td>

    <td>

        <button
            class="btn btn-primary btn-sm"
            onclick="uploadSPBY(${indexSPM},${indexDRPP},${indexSPBY})">

            <i class="fa-solid fa-upload"></i>

        </button>

    </td>

    <td>

        <button
            class="btn btn-info btn-sm"
            onclick="viewSPBY(${indexSPM},${indexDRPP},${indexSPBY})">

            <i class="fa-solid fa-file-pdf"></i>

        </button>

    </td>

    <td>

        <button
            class="btn btn-success btn-sm"
            onclick="downloadSPBY(${indexSPM},${indexDRPP},${indexSPBY})">

            <i class="fa-solid fa-download"></i>

        </button>

    </td>

</tr>

`;

}

/*====================================================
    MODAL UPLOAD
====================================================*/

let currentUpload = {

    spm: null,
    drpp: null,
    spby: null

};

function uploadSPBY(indexSPM, indexDRPP, indexSPBY) {

    currentUpload = {

        spm: indexSPM,
        drpp: indexDRPP,
        spby: indexSPBY

    };

    const modal = new bootstrap.Modal(
        document.getElementById("modalUpload")
    );

    modal.show();

}

/*====================================================
    VIEW PDF
====================================================*/

function viewSPBY(indexSPM, indexDRPP, indexSPBY) {

    const spby =
        dataSPM[indexSPM]
            .drpp[indexDRPP]
            .spby[indexSPBY];

    if (!spby.file) {

        alert("PDF belum diupload.");

        return;

    }

    window.open(spby.file, "_blank");

}

/*====================================================
    DOWNLOAD PDF
====================================================*/

function downloadSPBY(indexSPM, indexDRPP, indexSPBY) {

    const spby =
        dataSPM[indexSPM]
            .drpp[indexDRPP]
            .spby[indexSPBY];

    if (!spby.file) {

        alert("PDF belum tersedia.");

        return;

    }

    const a = document.createElement("a");

    a.href = spby.file;
    a.download = "";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

}

/*====================================================
    MODAL TAMBAH SPM
====================================================*/

function bukaModalSPM() {

    const modal = new bootstrap.Modal(
        document.getElementById("modalSPM")
    );

    modal.show();

}

/*====================================================
    MODAL DETAIL SPM
====================================================*/

function bukaDetailSPM(index) {

    const spm = dataSPM[index];

    const detail = document.getElementById("detailSPM");

    detail.innerHTML = `

<div class="row">

    <div class="col-md-6">

        <table class="table table-bordered">

            <tr>

                <th width="180">Nomor SPM</th>

                <td>${spm.nomor}</td>

            </tr>

            <tr>

                <th>Total</th>

                <td>${rupiah(spm.total)}</td>

            </tr>

            <tr>

                <th>Status</th>

                <td>

                    <span class="badge bg-${badgeStatus(spm.status)}">

                        ${spm.status}

                    </span>

                </td>

            </tr>

            <tr>

                <th>Jumlah DRPP</th>

                <td>${jumlahDRPP(spm)}</td>

            </tr>

        </table>

    </div>

</div>

`;

    const modal = new bootstrap.Modal(
        document.getElementById("modalDetailSPM")
    );

    modal.show();

}

/*====================================================
    TOMBOL TAMBAH SPM
====================================================*/

const btnTambah = document.getElementById("btnTambahSPM");

if (btnTambah) {

    btnTambah.addEventListener("click", bukaModalSPM);

}

/*====================================================
    SIMPAN DATA SPM
====================================================*/

async function simpanSPM() {

    const nomor = document.getElementById("nomorSPM").value.trim();
    const tanggal = document.getElementById("tanggalSPM").value;
    const total = document.getElementById("totalSPMInput").value;
    const status = document.getElementById("statusSPM").value;

    if (nomor === "") {

        alert("Nomor SPM harus diisi.");

        return;

    }

    dataSPM.push({

        id: Date.now(),

        nomor,

        tanggal,

        total,

        status,

        drpp: []

    });

    await saveData();

    await loadData();

    const modal = bootstrap.Modal.getInstance(

        document.getElementById("modalSPM")

    );

    if (modal) {

        modal.hide();

    }

}

/*====================================================
    EVENT SIMPAN
====================================================*/

const btnSimpan = document.getElementById("btnSimpanSPM");

if (btnSimpan) {

    btnSimpan.addEventListener("click", simpanSPM);

}

/*====================================================
    EVENT UPLOAD PDF
====================================================*/

const btnUpload = document.getElementById("btnUpload");

if (btnUpload) {

    btnUpload.addEventListener("click", async () => {

        const file = document.getElementById("filePDF").files[0];

        if (!file) {

            alert("Pilih file PDF.");

            return;

        }

        // Tahap berikutnya upload ke Google Drive
        alert("Tahap berikutnya file akan dikirim ke Google Drive.");

    });

}

/*====================================================
    FILTER STATUS
====================================================*/

function filterByStatus(status) {

    filterStatus = status;

    renderDashboard();

}

/*====================================================
    FILTER TAHUN
====================================================*/

function filterByTahun(tahun) {

    filterTahun = tahun;

    renderDashboard();

}

/*====================================================
    FILTER BULAN
====================================================*/

function filterByBulan(bulan) {

    filterBulan = bulan;

    renderDashboard();

}

/*====================================================
    REFRESH DATA
====================================================*/

async function refreshData() {

    await loadData();

}

/*====================================================
    LOGOUT
====================================================*/

function logout() {

    if (confirm("Logout?")) {

        location.href = "login.html";

    }

}

/*====================================================
    AUTO REFRESH
====================================================*/

setInterval(() => {

    loadData();

}, 60000);

/*====================================================
    HELPER FUNCTION
====================================================*/

/**
 * Mengambil data SPBY berdasarkan index.
 */
function getSPBY(indexSPM, indexDRPP, indexSPBY) {

    return dataSPM[indexSPM]
        ?.drpp[indexDRPP]
        ?.spby[indexSPBY] || null;

}

/**
 * Mengambil data DRPP berdasarkan index.
 */
function getDRPP(indexSPM, indexDRPP) {

    return dataSPM[indexSPM]
        ?.drpp[indexDRPP] || null;

}

/**
 * Mengambil data SPM berdasarkan index.
 */
function getSPM(indexSPM) {

    return dataSPM[indexSPM] || null;

}

/**
 * Reload dashboard.
 */
function reloadDashboard() {

    updateStatistic();

    renderDashboard();

}

/**
 * Reset Form Tambah SPM.
 */
function resetFormSPM() {

    document.getElementById("nomorSPM").value = "";
    document.getElementById("tanggalSPM").value = "";
    document.getElementById("totalSPMInput").value = "";
    document.getElementById("statusSPM").selectedIndex = 0;

}

/**
 * Tutup Modal Bootstrap.
 */
function closeModal(id) {

    const modal = bootstrap.Modal.getInstance(
        document.getElementById(id)
    );

    if (modal) {

        modal.hide();

    }

}
/*====================================================
    BAGIAN 6
    HELPER & VALIDATION
====================================================*/

/**
 * Menampilkan Loading
 */
function showLoading() {

    const loader = document.getElementById("loading");

    if (loader) {

        loader.style.display = "block";

    }

}

/**
 * Menyembunyikan Loading
 */
function hideLoading() {

    const loader = document.getElementById("loading");

    if (loader) {

        loader.style.display = "none";

    }

}

/**
 * Alert Success
 */
function showSuccess(message) {

    alert(message);

}

/**
 * Alert Error
 */
function showError(message) {

    alert(message);

}

/**
 * Validasi Nomor SPM
 */
function validasiSPM(nomor) {

    if (!nomor) {

        showError("Nomor SPM belum diisi.");

        return false;

    }

    const ada = dataSPM.some(item => item.nomor === nomor);

    if (ada) {

        showError("Nomor SPM sudah ada.");

        return false;

    }

    return true;

}

/**
 * Reload Dashboard
 */
function reloadDashboard() {

    updateStatistic();

    renderDashboard();

}

/**
 * Reset Filter
 */
function resetFilter() {

    keyword = "";
    filterStatus = "";
    filterTahun = "";
    filterBulan = "";

    const txt = document.getElementById("searchSPM");

    if (txt) {

        txt.value = "";

    }

    reloadDashboard();

}

/**
 * Format Number
 */
function angka(nilai) {

    return Number(nilai || 0);

}

/**
 * Format Persentase
 */
function persen(nilai, total) {

    if (total === 0) return "0%";

    return ((nilai / total) * 100).toFixed(1) + "%";

}
/*====================================================
    MODAL UPLOAD
====================================================*/

let currentUpload = {
    spm: null,
    drpp: null,
    spby: null
};

function uploadSPBY(indexSPM, indexDRPP, indexSPBY) {

    currentUpload = {
        spm: indexSPM,
        drpp: indexDRPP,
        spby: indexSPBY
    };

    const modal = new bootstrap.Modal(
        document.getElementById("modalUpload")
    );

    modal.show();
}

/*====================================================
    VIEW PDF
====================================================*/

function viewSPBY(indexSPM, indexDRPP, indexSPBY) {

    const spby =
        dataSPM[indexSPM]
        .drpp[indexDRPP]
        .spby[indexSPBY];

    if (!spby.file) {

        alert("PDF belum diupload.");
        return;

    }

    window.open(spby.file, "_blank");

}

/*====================================================
    DOWNLOAD PDF
====================================================*/

function downloadSPBY(indexSPM, indexDRPP, indexSPBY) {

    const spby =
        dataSPM[indexSPM]
        .drpp[indexDRPP]
        .spby[indexSPBY];

    if (!spby.file) {

        alert("PDF belum tersedia.");
        return;

    }

    const a = document.createElement("a");

    a.href = spby.file;
    a.download = "";
    a.click();

}

/*====================================================
    SIMPAN DATA SPM
====================================================*/

async function simpanSPM() {

    const nomor = document.getElementById("nomorSPM").value.trim();
    const tanggal = document.getElementById("tanggalSPM").value;
    const total = document.getElementById("totalSPMInput").value;
    const status = document.getElementById("statusSPM").value;

    if (nomor === "") {

        alert("Nomor SPM harus diisi.");
        return;

    }

    dataSPM.push({

        id: Date.now(),
        nomor,
        tanggal,
        total,
        status,
        drpp: []

    });

    await saveData();
    await loadData();

    bootstrap.Modal
        .getInstance(document.getElementById("modalSPM"))
        .hide();

}

/*====================================================
    REGISTER BUTTON
====================================================*/

const btnTambah = document.getElementById("btnTambahSPM");

if (btnTambah) {

    btnTambah.addEventListener("click", bukaModalSPM);

}

const btnSimpan = document.getElementById("btnSimpanSPM");

if (btnSimpan) {

    btnSimpan.addEventListener("click", simpanSPM);

}

const btnUpload = document.getElementById("btnUpload");

if (btnUpload) {

    btnUpload.addEventListener("click", async () => {

        const file =
            document.getElementById("filePDF").files[0];

        if (!file) {

            alert("Pilih file PDF.");
            return;

        }

        alert("Tahap berikutnya file akan dikirim ke Google Drive.");

    });

}

/*====================================================
    FILTER
====================================================*/

function filterByStatus(status) {

    filterStatus = status;
    renderDashboard();

}

function filterByTahun(tahun) {

    filterTahun = tahun;
    renderDashboard();

}

function filterByBulan(bulan) {

    filterBulan = bulan;
    renderDashboard();

}

/*====================================================
    LOGOUT
====================================================*/

function logout() {

    if (confirm("Logout?")) {

        location.href = "login.html";

    }

}

/*====================================================
    AUTO REFRESH
====================================================*/

setInterval(() => {

    loadData();

}, 60000);

/*====================================================
    BAGIAN 8
    HELPER & UTILITIES
====================================================*/

/*====================================================
    CARI SPM BERDASARKAN ID
====================================================*/

function getSPMById(id) {

    return dataSPM.find(item => item.id == id);

}

/*====================================================
    CARI DRPP
====================================================*/

function getDRPP(indexSPM, indexDRPP) {

    if (!dataSPM[indexSPM]) return null;

    return dataSPM[indexSPM].drpp[indexDRPP];

}

/*====================================================
    CARI SPBY
====================================================*/

function getSPBY(indexSPM, indexDRPP, indexSPBY) {

   /*====================================================
    BAGIAN 9
    HELPER & VALIDASI DATA
====================================================*/

/*====================================================
    CEK DATA SPM
====================================================*/

function validasiSPM(spm) {

    if (!spm) return false;

    if (!spm.nomor) return false;

    if (!spm.status) return false;

    if (!Array.isArray(spm.drpp)) {

        spm.drpp = [];

    }

    return true;

}

/*====================================================
    NORMALISASI DATA
====================================================*/

function normalisasiData() {

    dataSPM.forEach(spm => {

        if (!spm.drpp) {

            spm.drpp = [];

        }

        spm.drpp.forEach(drpp => {

            if (!drpp.spby) {

                drpp.spby = [];

            }

        });

    });

}

/*====================================================
    HITUNG TOTAL NOMINAL DRPP
====================================================*/

function totalNominalDRPP(spm) {

    if (!spm.drpp) return 0;

    return spm.drpp.reduce((total, drpp) => {

        return total + Number(drpp.total || 0);

    }, 0);

}

/*====================================================
    HITUNG TOTAL NOMINAL SPBY
====================================================*/

function totalNominalSPBY(drpp) {

    if (!drpp.spby) return 0;

    return drpp.spby.reduce((total, spby) => {

        return total + Number(spby.total || 0);

    }, 0);

}

/*====================================================
    FORMAT TANGGAL INDONESIA
====================================================*/

function formatTanggal(tanggal) {

    if (!tanggal) return "-";

    return new Date(tanggal).toLocaleDateString("id-ID", {

        day: "2-digit",
        month: "long",
        year: "numeric"

    });

}

/*====================================================
    CEK FILE PDF
====================================================*/

function isPDF(file) {

    if (!file) return false;

    return file.type === "application/pdf";

}

/*====================================================
    CEK UKURAN FILE
====================================================*/

function ukuranFile(file) {

    if (!file) return "";

    return (file.size / 1024 / 1024).toFixed(2) + " MB";

}

/*====================================================
    RESET FORM MODAL SPM
====================================================*/

function resetFormSPM() {

    document.getElementById("nomorSPM").value = "";
    document.getElementById("tanggalSPM").value = "";
    document.getElementById("totalSPMInput").value = "";
    document.getElementById("statusSPM").selectedIndex = 0;

}

/*====================================================
    RESET FORM UPLOAD
====================================================*/

function resetUpload() {

    document.getElementById("filePDF").value = "";

    currentUpload = {

        spm: null,
        drpp: null,
        spby: null

    };

}
    /*====================================================
    BAGIAN 10
    UPLOAD PDF KE GOOGLE APPS SCRIPT
====================================================*/

/*====================================================
    KONVERSI FILE KE BASE64
====================================================*/

function fileToBase64(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = e => {

            resolve(e.target.result);

        };

        reader.onerror = reject;

        reader.readAsDataURL(file);

    });

}

/*====================================================
    UPLOAD PDF
====================================================*/

async function prosesUploadPDF() {

    const file = document.getElementById("filePDF").files[0];

    if (!file) {

        alert("Pilih file PDF.");
        return;

    }

    if (file.type !== "application/pdf") {

        alert("File harus berformat PDF.");
        return;

    }

    try {

        const base64 = await fileToBase64(file);

        const payload = {

            action: "uploadPDF",

            spm: currentUpload.spm,
            drpp: currentUpload.drpp,
            spby: currentUpload.spby,

            fileName: file.name,
            mimeType: file.type,
            data: base64

        };

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(payload)

        });

        const result = await response.json();

        if (!result.success) {

            alert(result.message || "Upload gagal.");
            return;

        }

        const spby =
            dataSPM[currentUpload.spm]
            .drpp[currentUpload.drpp]
            .spby[currentUpload.spby];

        spby.file = result.url || "";

        await saveData();

        bootstrap.Modal
            .getInstance(document.getElementById("modalUpload"))
            .hide();

        alert("Upload berhasil.");

        renderDashboard();

    }
    catch (err) {

        console.error(err);

        alert("Terjadi kesalahan saat upload.");

    }

}

/*====================================================
    EVENT BUTTON UPLOAD
====================================================*/

const btnUploadPDF = document.getElementById("btnUpload");

if (btnUploadPDF) {

    btnUploadPDF.addEventListener("click", prosesUploadPDF);

}
    /*====================================================
    BAGIAN 11
    GOOGLE APPS SCRIPT
    UPLOAD PDF KE GOOGLE DRIVE
====================================================*/

const FOLDER_ID = "GANTI_DENGAN_FOLDER_ID";

/*====================================================
    POST
====================================================*/

function doPost(e) {

    try {

        const data = JSON.parse(e.postData.contents);

        if (data.action === "uploadPDF") {

            return uploadPDF(data);

        }

        return ContentService
            .createTextOutput(JSON.stringify({

                success: false,
                message: "Action tidak dikenali."

            }))
            .setMimeType(ContentService.MimeType.JSON);

    }

    catch (err) {

        return ContentService
            .createTextOutput(JSON.stringify({

                success: false,
                message: err.toString()

            }))
            .setMimeType(ContentService.MimeType.JSON);

    }

}

/*====================================================
    UPLOAD PDF
====================================================*/

function uploadPDF(data) {

    const folder =
        DriveApp.getFolderById(FOLDER_ID);

    const bytes = Utilities.base64Decode(

        data.data.split(",")[1]

    );

    const blob = Utilities.newBlob(

        bytes,
        data.mimeType,
        data.fileName

    );

    const file = folder.createFile(blob);

    file.setSharing(

        DriveApp.Access.ANYONE_WITH_LINK,
        DriveApp.Permission.VIEW

    );

    return ContentService
        .createTextOutput(JSON.stringify({

            success: true,

            id: file.getId(),

            name: file.getName(),

            url: file.getUrl(),

            download:
                "https://drive.google.com/uc?export=download&id=" +
                file.getId()

        }))
        .setMimeType(ContentService.MimeType.JSON);

}
    /*====================================================
    INITIALIZATION
====================================================*/

function initializeDashboard() {

    registerEvent();

    updateStatistic();

    renderDashboard();

}

/*====================================================
    APPLICATION START
====================================================*/

document.addEventListener("DOMContentLoaded", async () => {

    try {

        initializeDashboard();

        await loadData();

    } catch (error) {

        console.error("Gagal memulai aplikasi:", error);

        alert("Dashboard gagal dimuat.");

    }

});

/*====================================================
    GLOBAL EVENT
====================================================*/

window.addEventListener("focus", () => {

    refreshData();

});

window.addEventListener("online", () => {

    console.log("Koneksi internet aktif.");

    refreshData();

});

window.addEventListener("offline", () => {

    console.warn("Koneksi internet terputus.");

});

/*====================================================
    AUTO REFRESH
====================================================*/

setInterval(async () => {

    try {

        await refreshData();

    } catch (error) {

        console.error(error);

    }

}, 60000);

/*====================================================
    END OF FILE
====================================================*/

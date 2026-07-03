/*====================================================
    MONITORING SPJ SATKER
    dashboard.js
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

/*====================================================
    START
====================================================*/

document.addEventListener("DOMContentLoaded", async () => {

    registerEvent();

    await loadData();

});

/*====================================================
    REGISTER EVENT
====================================================*/

function registerEvent() {

    const txtSearch = document.getElementById("searchSPM");

    if (txtSearch) {

        txtSearch.addEventListener("keyup", function () {

            keyword = this.value.toLowerCase();

            renderDashboard();

        });

    }

}

/*====================================================
    LOAD DATA DARI GOOGLE APPS SCRIPT
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

        console.log("Jumlah SPM :", dataSPM.length);

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
    SIMPAN DATA KE GOOGLE APPS SCRIPT
====================================================*/

async function saveData() {

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            body: JSON.stringify(dataSPM)

        });

        const result = await response.json();

        console.log(result);

    }

    catch (error) {

        console.error(error);

        alert("Gagal menyimpan data.");

    }

}
/*====================================================
    FORMAT RUPIAH
====================================================*/

function rupiah(nilai) {

    return Number(nilai || 0).toLocaleString("id-ID", {

        style: "currency",

        currency: "IDR"

    });

}
/*====================================================
    UPDATE STATISTIK DASHBOARD
====================================================*/

function updateStatistic() {

    let totalSPM = dataSPM.length;

    let totalMenunggu = 0;
    let totalRevisi = 0;
    let totalSelesai = 0;

    dataSPM.forEach(spm => {

        const status = (spm.status || "").toLowerCase();

        if (status === "menunggu" || status === "menunggu verifikasi") {

            totalMenunggu++;

        } else if (status === "revisi") {

            totalRevisi++;

        } else if (status === "selesai") {

            totalSelesai++;

        }

    });

    const elSPM = document.getElementById("totalSPM");
    const elMenunggu = document.getElementById("totalMenunggu");
    const elRevisi = document.getElementById("totalRevisi");
    const elSelesai = document.getElementById("totalSelesai");

    if (elSPM) elSPM.innerText = totalSPM;
    if (elMenunggu) elMenunggu.innerText = totalMenunggu;
    if (elRevisi) elRevisi.innerText = totalRevisi;
    if (elSelesai) elSelesai.innerText = totalSelesai;

}
/*====================================================
    WARNA STATUS
====================================================*/

function badgeStatus(status) {

    switch ((status || "").toLowerCase()) {

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
    HITUNG JUMLAH DRPP
====================================================*/

function jumlahDRPP(spm) {

    if (!spm.drpp) return 0;

    return spm.drpp.length;

}
/*====================================================
    HITUNG JUMLAH SPBY
====================================================*/

function jumlahSPBY(spm) {

    if (!spm.drpp) return 0;

    let total = 0;

    spm.drpp.forEach(drpp => {

        if (drpp.spby) {

            total += drpp.spby.length;

        }

    });

    return total;

}
/*====================================================
    RENDER DASHBOARD
====================================================*/

function renderDashboard() {

    const tbody = document.getElementById("tableSPM");

    if (!tbody) return;

    tbody.innerHTML = "";

    // Jika tidak ada data
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

    // Filter Search
    let hasil = dataSPM.filter(item => {

        if (keyword === "") return true;

        return (
            item.nomor.toLowerCase().includes(keyword)
        );

    });

    hasil.forEach((spm, index) => {

        tbody.innerHTML += renderSPM(spm, index);

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

${rupiah(spm.total || 0)}

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

<button
class="btn btn-primary btn-sm">

<i class="fa fa-upload"></i>

</button>

</td>

<td>

<button
class="btn btn-info btn-sm">

<i class="fa fa-file-pdf"></i>

</button>

</td>

<td>

<button
class="btn btn-success btn-sm">

<i class="fa fa-download"></i>

</button>

</td>

</tr>

<tr id="detail-${index}" style="display:none;">

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

    const baris = document.getElementById("detail-" + index);

    const isi = document.getElementById("isi-detail-" + index);

    if (baris.style.display === "none") {

        baris.style.display = "";

        isi.innerHTML = renderDRPP(index);

    } else {

        baris.style.display = "none";

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

${rupiah(drpp.total || 0)}

</td>

<td>

<span class="badge bg-${badgeStatus(drpp.status)}">

${drpp.status}

</span>

</td>

<td>

<button
class="btn btn-primary btn-sm">

<i class="fa-solid fa-plus"></i>

Tambah SPBy

</button>

</td>

</tr>

<tr
id="detail-drpp-${indexSPM}-${indexDRPP}"
style="display:none;">

<td colspan="5">

<div id="isi-drpp-${indexSPM}-${indexDRPP}">

</div>

</td>

</tr>

`;

}
/*====================================================
    TOGGLE DRPP
====================================================*/

function toggleDRPP(indexSPM,indexDRPP){

    const row = document.getElementById(

        "detail-drpp-"+indexSPM+"-"+indexDRPP

    );

    const isi = document.getElementById(

        "isi-drpp-"+indexSPM+"-"+indexDRPP

    );

    if(row.style.display=="none"){

        row.style.display="";

        isi.innerHTML = renderSPBY(

            indexSPM,

            indexDRPP

        );

    }else{

        row.style.display="none";

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

    drpp.spby.forEach((spby, index) => {

        html += renderBarisSPBY(indexSPM, indexDRPP, index, spby);

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
    UPLOAD PDF
====================================================*/

function uploadSPBY(indexSPM, indexDRPP, indexSPBY) {

    console.log("Upload :", indexSPM, indexDRPP, indexSPBY);

    alert("Fitur Upload PDF akan dihubungkan ke Google Drive.");

}

/*====================================================
    VIEW PDF
====================================================*/

function viewSPBY(indexSPM, indexDRPP, indexSPBY) {

    console.log("View :", indexSPM, indexDRPP, indexSPBY);

    alert("Preview PDF.");

}

/*====================================================
    DOWNLOAD PDF
====================================================*/

function downloadSPBY(indexSPM, indexDRPP, indexSPBY) {

    console.log("Download :", indexSPM, indexDRPP, indexSPBY);

    alert("Download PDF.");

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

                        <td>${rupiah(spm.total || 0)}</td>

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
    MODAL UPLOAD
====================================================*/

let currentUpload = {

    spm: null,

    drpp: null,

    spby: null

};

function uploadSPBY(indexSPM,indexDRPP,indexSPBY){

    currentUpload = {

        spm:indexSPM,

        drpp:indexDRPP,

        spby:indexSPBY

    };

    const modal = new bootstrap.Modal(

        document.getElementById("modalUpload")

    );

    modal.show();

}
/*====================================================
    TOMBOL VIEW PDF
====================================================*/

function viewSPBY(indexSPM,indexDRPP,indexSPBY){

    const spby =

    dataSPM[indexSPM]

    .drpp[indexDRPP]

    .spby[indexSPBY];

    if(!spby.file){

        alert("PDF belum diupload.");

        return;

    }

    window.open(

        spby.file,

        "_blank"

    );


/*====================================================
    DOWNLOAD PDF
====================================================*/

function downloadSPBY(indexSPM,indexDRPP,indexSPBY){

    const spby =

    dataSPM[indexSPM]

    .drpp[indexDRPP]

    .spby[indexSPBY];

    if(!spby.file){

        alert("PDF belum tersedia.");

        return;

    }

    const a = document.createElement("a");

    a.href = spby.file;

    a.download = "";

    a.click();

}
    /*====================================================
    TOMBOL TAMBAH SPM
====================================================*/

const btnTambah = document.getElementById("btnTambahSPM");

if(btnTambah){

    btnTambah.addEventListener("click",()=>{

        bukaModalSPM();

    });

}
    /*====================================================
    SIMPAN DATA SPM
====================================================*/

async function simpanSPM() {

    const nomor = document.getElementById("nomorSPM").value;
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

    bootstrap.Modal.getInstance(
        document.getElementById("modalSPM")
    ).hide();

}
    /*====================================================
    EVENT SIMPAN
====================================================*/

const btnSimpan = document.getElementById("btnSimpanSPM");

if (btnSimpan) {

    btnSimpan.addEventListener("click", () => {

        simpanSPM();

    });

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

        alert("Tahap berikutnya file akan dikirim ke Google Drive.");

    });

}
    /*====================================================
    FILTER STATUS
====================================================*/

function filterByStatus(status){

    filterStatus = status;

    renderDashboard();

}
    /*====================================================
    FILTER TAHUN
====================================================*/

function filterByTahun(tahun){

    filterTahun = tahun;

    renderDashboard();

}
    /*====================================================
    FILTER BULAN
====================================================*/

function filterByBulan(bulan){

    filterBulan = bulan;

    renderDashboard();

}
    /*====================================================
    LOGOUT
====================================================*/

function logout(){

    if(confirm("Logout?")){

        location.href="login.html";

    }

}
    /*====================================================
    AUTO REFRESH
====================================================*/

setInterval(()=>{

    loadData();

},60000);

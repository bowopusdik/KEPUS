/*====================================================
    MONITORING SPJ SATKER
    dashboard.js
====================================================*/
 
/*====================================================
    GOOGLE APPS SCRIPT
====================================================*/

// URL Web App Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbxD2LU3sdIno_YmDGEh5HhTlOs48WpvxQSZUS5RQwdw_1vW5PDn6W9pNiALq7eYg8E3/exec";


/*====================================================
    KONFIGURASI USER
====================================================*/

let currentUser = {
    nama: "Administrator",
    role: "admin"
};


/*====================================================
    DATA
====================================================*/

// Menyimpan seluruh data SPM dari Google Spreadsheet
let dataSPM = [];


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

            alert("Gagal mengambil data dari server.");

            return;

        }

        // Simpan data
        dataSPM = result.data || [];

        console.log("Data SPM :", dataSPM);

        // Render Dashboard
        renderDashboard();

        // Update Statistik
        updateStatistic();

    } catch (error) {

        console.error("Load Data Error :", error);

        alert("Tidak dapat terhubung ke Google Apps Script.");

    }

}


/*====================================================
    LOAD DASHBOARD
====================================================*/

document.addEventListener("DOMContentLoaded", () => {

    loadData();

});
/*====================================================
UPDATE STATISTIK
====================================================*/

function updateStatistic() {

    document.getElementById("totalSPM").innerText = dataSPM.length;

    document.getElementById("totalDRPP").innerText = 0;

    document.getElementById("totalSPBY").innerText = 0;

    document.getElementById("totalSelesai").innerText =
        dataSPM.filter(item => item.status === "Selesai").length;

}

/*====================================================
RENDER DASHBOARD
====================================================*/

function renderDashboard() {

    const tbody = document.getElementById("tableSPM");

    tbody.innerHTML = "";

    if (dataSPM.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    Belum ada data SPM
                </td>
            </tr>
        `;

        return;
    }

    dataSPM.forEach((spm) => {

        tbody.innerHTML += `
            <tr>
                <td>${spm.nomor}</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>${spm.status}</td>
                <td>
                    <button class="btn btn-success btn-sm">
                        <i class="fa fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;

    });

}

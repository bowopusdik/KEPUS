/*====================================================
    GOOGLE APPS SCRIPT
====================================================*/

// URL Web App Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbxD2LU3sdIno_YmDGEh5HhTlOs48WpvxQSZUS5RQwdw_1vW5PDn6W9pNiALq7eYg8E3/exec";


/*====================================================
    DATA
====================================================*/

// Menyimpan seluruh data SPM
let dataSPM = [];


/*====================================================
    LOAD DATA DARI GOOGLE APPS SCRIPT
====================================================*/

async function loadData() {

    try {

        // Mengambil data dari Google Apps Script
        const response = await fetch(API_URL);
        const result = await response.json();

        console.log("Response API :", result);

        // Cek status response
        if (!result.success) {
            alert("Gagal mengambil data dari server.");
            return;
        }

        // Simpan data ke variabel global
        dataSPM = result.data || [];

        // Tampilkan ke dashboard
        renderDashboard();

        // Update statistik
        updateStatistic();

    } catch (error) {

        console.error("Load Data Error :", error);

        alert("Tidak dapat terhubung ke Google Apps Script.");

    }

}


/*====================================================
    LOAD DASHBOARD
====================================================*/

document.addEventListener("DOMContentLoaded", function () {

    loadData();

});

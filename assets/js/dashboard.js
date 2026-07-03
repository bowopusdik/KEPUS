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

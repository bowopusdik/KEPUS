/*====================================================
    MONITORING SPJ SATKER
    dashboard.js
====================================================*/

/*====================================================
    GOOGLE APPS SCRIPT
====================================================*/

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

let dataSPM = [];

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

        console.log(result);

        if (!result.success) {
            alert("Gagal mengambil data.");
            return;
        }

        dataSPM = result.data || [];

        renderDashboard();
        updateStatistic();

    } catch (err) {

        console.error(err);
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
    WARNA STATUS
====================================================*/

function warnaStatus(status) {

    switch (status) {

        case "Selesai":
            return "selesai";

        case "Revisi":
            return "revisi";

        default:
            return "belum";

    }

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

  dataSPM.forEach((spm, index) => {

        tbody.innerHTML += `
            <tr>
                <td>${spm.nomor}</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>
                    <span class="status status-${warnaStatus(spm.status)}">
                        ${spm.status}
                    </span>
                </td>
                <td>
                 <button
    class="btn btn-success btn-sm"
    onclick="toggleSPM(${index})">

    <i class="fa fa-eye"></i>

</button>   
                </td>
            </tr>
        `;

    });

}
/*====================================================
TOGGLE DETAIL SPM
====================================================*/

function toggleSPM(index) {

    const spm = dataSPM[index];

    alert(
        "Nomor SPM : " + spm.nomor +
        "\nStatus : " + spm.status
    );

}

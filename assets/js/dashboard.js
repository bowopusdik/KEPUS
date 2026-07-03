/*=====================================================
    DASHBOARD MONITORING SPJ SATKER
======================================================*/

/*=====================================================
    GOOGLE APPS SCRIPT
======================================================*/

const API_URL =
"https://script.google.com/macros/s/AKfycbxD2LU3sdIno_YmDGEh5HhTlOs48WpvxQSZUS5RQwdw_1vW5PDn6W9pNiALq7eYg8E3/exec";

/*=====================================================
    GLOBAL VARIABLE
======================================================*/

let dataSPM = [];

let currentUser = {
    nama: "Administrator",
    role: "admin"
};

let filterStatus = "";
let filterTahun = "";
let filterBulan = "";
let keyword = "";

/*=====================================================
    START
======================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initDashboard();

});

/*=====================================================
    INIT
======================================================*/

async function initDashboard(){

    await loadData();

    registerEvent();

}
/*=====================================================
LOAD DATA
======================================================*/

async function loadData(){

    try{

        const response = await fetch(API_URL);

        const result = await response.json();

        console.log(result);

        if(!result.success){

            alert("Data gagal dibaca.");

            return;

        }

        dataSPM = result.data;

        updateStatistic();

        renderDashboard();

    }catch(err){

        console.error(err);

        alert("Tidak dapat terhubung ke server.");

    }

}
/*=====================================================
REGISTER EVENT
======================================================*/

function registerEvent(){

    document
    .getElementById("searchSPM")
    .addEventListener("keyup",(e)=>{

        keyword = e.target.value;

        renderDashboard();

    });

}
/*=====================================================
UPDATE STATISTIK
======================================================*/

function updateStatistic() {

    let totalSPM = dataSPM.length;

    let totalMenunggu = 0;
    let totalRevisi = 0;
    let totalSelesai = 0;

    dataSPM.forEach(spm => {

        switch ((spm.status || "").toLowerCase()) {

            case "menunggu":
            case "menunggu verifikasi":
                totalMenunggu++;
                break;

            case "revisi":
                totalRevisi++;
                break;

            case "selesai":
                totalSelesai++;
                break;

        }

    });

    document.getElementById("totalSPM").innerText = totalSPM;

    document.getElementById("totalMenunggu").innerText = totalMenunggu;

    document.getElementById("totalRevisi").innerText = totalRevisi;

    document.getElementById("totalSelesai").innerText = totalSelesai;

}

/*=====================================================
WARNA STATUS
======================================================*/

function badgeStatus(status){

    switch((status || "").toLowerCase()){

        case "selesai":
            return "success";

        case "revisi":
            return "warning";

        case "menunggu":
        case "menunggu verifikasi":
            return "info";

        default:
            return "secondary";

    }

}
/*=====================================================
RENDER DASHBOARD
======================================================*/

function renderDashboard(){

    const tbody = document.getElementById("tableSPM");

    tbody.innerHTML = "";

    let no = 1;

    dataSPM.forEach((spm,index)=>{

        if(keyword){

            const cari = keyword.toLowerCase();

            if(!spm.nomor.toLowerCase().includes(cari))
                return;

        }

        tbody.innerHTML += `

        <tr>

            <td>

                <button
                class="btn btn-outline-primary btn-sm"
                onclick="detailSPM(${index})">

                <i class="fa-solid fa-eye"></i>

                </button>

            </td>

            <td>${no++}</td>

            <td>

                <strong>${spm.nomor}</strong>

            </td>

            <td>

                -

            </td>

            <td>

                ${spm.drpp ? spm.drpp.length : 0}

            </td>

            <td>

                0

            </td>

            <td>

                <span class="badge bg-${badgeStatus(spm.status)}">

                    ${spm.status}

                </span>

            </td>

            <td>

                <button
                class="btn btn-primary btn-sm">

                <i class="fa-solid fa-upload"></i>

                </button>

            </td>

            <td>

                <button
                class="btn btn-info btn-sm">

                <i class="fa-solid fa-file-pdf"></i>

                </button>

            </td>

            <td>

                <button
                class="btn btn-success btn-sm">

                <i class="fa-solid fa-download"></i>

                </button>

            </td>

        </tr>

        `;

    });

}
/*=====================================================
DETAIL SPM
======================================================*/

function detailSPM(index){

    const spm = dataSPM[index];

    alert(

`Nomor SPM : ${spm.nomor}

Status : ${spm.status}

Jumlah DRPP : ${spm.drpp.length}`

    );

}

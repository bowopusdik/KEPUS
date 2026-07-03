
/*====================================================
  KEPUS Dashboard
  dashboard.js
====================================================*/

/*====================================================
  KONFIGURASI
====================================================*/

// URL Google Apps Script
const API_URL = "";

// Role User
let currentUser = {
    nama: "Administrator",
    role: "admin"
};

//====================================================
// DATA
//====================================================

let dataSPM = [];

/*
Struktur Data

SPM
 ├── DRPP
 │      ├── SPBY
 │      ├── Kwitansi
 │      └── Surat Tugas
*/

dataSPM = [

{

id:1,

nomor:"SPM-001",

status:"Revisi",

drpp:[

{

nomor:"DRPP-001",

status:"Selesai",

spby:[

{

nomor:"SPBY-001",

kwitansi:"KW-001",

surat:"ST-001",

status:"Selesai",

upload:false,

file:null

},

{

nomor:"SPBY-002",

kwitansi:"KW-002",

surat:"ST-002",

status:"Belum",

upload:false,

file:null

}

]

},

{

nomor:"DRPP-002",

status:"Revisi",

spby:[

{

nomor:"SPBY-003",

kwitansi:"KW-003",

surat:"ST-003",

status:"Revisi",

upload:false,

file:null

}

]

}

]

},

{

id:2,

nomor:"SPM-002",

status:"Belum",

drpp:[

{

nomor:"DRPP-003",

status:"Belum",

spby:[

{

nomor:"SPBY-004",

kwitansi:"KW-004",

surat:"ST-004",

status:"Belum",

upload:false,

file:null

}

]

}

]

}

];
/*====================================================
  LOAD DASHBOARD
====================================================*/

document.addEventListener("DOMContentLoaded",()=>{

renderDashboard();

updateStatistic();

});

/*====================================================
  STATISTIK
====================================================*/

function updateStatistic(){

const totalSPM=dataSPM.length;

let totalDRPP=0;
let totalSPBY=0;
let selesai=0;

dataSPM.forEach(spm=>{

totalDRPP+=spm.drpp.length;

spm.drpp.forEach(dr=>{

totalSPBY+=dr.spby.length;

dr.spby.forEach(s=>{

if(s.status==="Selesai") selesai++;

});

});

});

document.getElementById("totalSPM").innerText=totalSPM;

document.getElementById("totalDRPP").innerText=totalDRPP;

document.getElementById("totalSPBY").innerText=totalSPBY;

document.getElementById("totalSelesai").innerText=selesai;

}
/*====================================================
  RENDER DASHBOARD
====================================================*/

function renderDashboard(){

const tbody=document.getElementById("tableSPM");

tbody.innerHTML="";

dataSPM.forEach((spm,index)=>{

tbody.innerHTML+=`

<tr class="spm-row">

<td>

<button class="btn btn-link"

onclick="toggleSPM(${index})">

<i class="fa-solid fa-folder"></i>

${spm.nomor}

</button>

</td>

<td>${spm.drpp.length}</td>

<td>-</td>

<td>-</td>

<td>

<span class="status status-${warnaStatus(spm.status)}">

${spm.status}

</span>

</td>

<td>

<button class="btn btn-success btn-sm">

<i class="fa fa-eye"></i>

</button>

</td>

</tr>

<tr id="spm${index}" style="display:none">

<td colspan="6">

<div id="detail${index}"></div>

</td>

</tr>

`;

});

}

/*====================================================
    GOOGLE APPS SCRIPT
====================================================*/

// Ganti dengan URL Web App Google Apps Script Anda
const API_URL =
"https://script.google.com/macros/s/ISI_WEBAPP_URL_ANDA/exec";

/*====================================================
LOAD DATA
====================================================*/

async function loadData(){

    try{

        const response = await fetch(API_URL);

        const result = await response.json();

        dataSPM = result.data;

        renderDashboard();

        updateStatistic();
simpanData();

    }catch(err){

        console.error(err);

        alert("Gagal mengambil data.");

    }

}
/*====================================================
  KEPUS Dashboard
  dashboard.js
====================================================*/

/*====================================================
  KONFIGURASI
====================================================*/

// URL Google Apps Script


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

loadData();

});
/*====================================================
SIMPAN DATA
====================================================*/
updateStatistic();
simpanData();
toast("Data berhasil disimpan");
async function simpanData(){

    try{

        await fetch(API_URL,{

            method:"POST",

            body:JSON.stringify(dataSPM)

        });

    }catch(err){

        console.log(err);

    }

}

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
/*====================================================
  WARNA STATUS
====================================================*/

function warnaStatus(status){

    switch(status){

        case "Selesai":
            return "selesai";

        case "Revisi":
            return "revisi";

        default:
            return "belum";

    }

}

/*====================================================
  TOGGLE SPM
====================================================*/

function toggleSPM(index){

    const row=document.getElementById("spm"+index);

    if(row.style.display==="none"){

        row.style.display="table-row";

        renderDRPP(index);

    }else{

        row.style.display="none";

    }

}

/*====================================================
  RENDER DRPP
====================================================*/

function renderDRPP(index){
;
    const container=document.getElementById("detail"+index);

    const spm=dataSPM[index];

    let html="";

    spm.drpp.forEach((drpp,i)=>{

        html+=`

        <table class="table table-bordered table-sm mb-3">

        <thead class="table-light">

        <tr>

            <th width="30%">DRPP</th>

            <th>Status</th>

            <th width="180">Aksi</th>

        </tr>

        </thead>

        <tbody>

        <tr>

            <td>

                <button class="btn btn-link"

                onclick="toggleDRPP(${index},${i})">

                <i class="fa-solid fa-folder-open text-warning"></i>

                ${drpp.nomor}

                </button>

            </td>

            <td>

                <span class="status status-${warnaStatus(drpp.status)}">

                ${drpp.status}

                </span>

            </td>

            <td>

                <button class="btn btn-primary btn-sm"

                onclick="tambahSPBY(${index},${i})">

                <i class="fa fa-plus"></i>

                SPBy

                </button>

            </td>

        </tr>

        <tr id="drpp-${index}-${i}"

        style="display:none">

        <td colspan="3">

        <div id="spby-${index}-${i}"></div>

        </td>

        </tr>

        </tbody>

        </table>

        `;

    });

    container.innerHTML=html;

}

/*====================================================
  TOGGLE DRPP
====================================================*/

function toggleDRPP(index,drppIndex){

    const row=document.getElementById(

        `drpp-${index}-${drppIndex}`

    );

    if(row.style.display==="none"){

        row.style.display="table-row";

        renderSPBY(index,drppIndex);
;
    }else{

        row.style.display="none";

    }

}

/*====================================================
  RENDER SPBY
====================================================*/

function renderSPBY(index,drppIndex){
;
    const container=document.getElementById(

        `spby-${index}-${drppIndex}`

    );

    const list=dataSPM[index]

    .drpp[drppIndex]

    .spby;

    let html="";

    html+=`

    <table class="table table-striped table-hover">

    <thead>

    <tr>

        <th>No SPBY</th>

        <th>No Kwitansi</th>

        <th>Surat Tugas</th>

        <th>Status</th>

        <th>Upload</th>

        <th>View</th>

        <th>Download</th>

    </tr>

    </thead>

    <tbody>

    `;

    list.forEach((item,n)=>{

        html+=`

        <tr>

        <td>${item.nomor}</td>

        <td>${item.kwitansi}</td>

        <td>${item.surat}</td>

        <td>

        <span class="status status-${warnaStatus(item.status)}">

        ${item.status}

        </span>

        </td>

        <td>

        <button class="btn btn-primary btn-sm"

        onclick="uploadFile(${index},${drppIndex},${n})">

        <i class="fa fa-upload"></i>

        </button>

        </td>

        <td>

        <button class="btn btn-success btn-sm"

        onclick="viewFile(${index},${drppIndex},${n})">

        <i class="fa fa-eye"></i>

        </button>

        </td>

        <td>

        <button class="btn btn-secondary btn-sm"

        onclick="downloadFile(${index},${drppIndex},${n})">

        <i class="fa fa-download"></i>

        </button>

        </td>

        </tr>

        `;

    });

    html+=`

    </tbody>

    </table>

    `;

    container.innerHTML=html;

}
/*====================================================
  TAMBAH SPM
====================================================*/

function tambahSPM(){

    const nomor=prompt("Masukkan Nomor SPM");

    if(!nomor) return;

    dataSPM.push({

        id:Date.now(),

        nomor:nomor,

        status:"Belum",

        drpp:[]

    });

    renderDashboard();
    updateStatistic();
simpanData();
}

/*====================================================
  TAMBAH DRPP
====================================================*/

function tambahDRPP(index){

    const nomor=prompt("Masukkan Nomor DRPP");

    if(!nomor) return;

    dataSPM[index].drpp.push({

        nomor:nomor,

        status:"Belum",

        spby:[]

    });

    renderDashboard();
;
}

/*====================================================
  TAMBAH SPBY
====================================================*/

function tambahSPBY(index,drppIndex){

    const nomor=prompt("Nomor SPBY");

    if(!nomor) return;

    const kw=prompt("Nomor Kwitansi");

    if(!kw) return;

    const st=prompt("Nomor Surat Tugas");

    if(!st) return;

    dataSPM[index]

    .drpp[drppIndex]

    .spby.push({

        nomor:nomor,

        kwitansi:kw,

        surat:st,

        status:"Belum",

        upload:false,

        file:null

    });

    renderDRPP(index);

    updateStatistic();
simpanData();
}

/*====================================================
  SEARCH SPM
====================================================*/

function cariSPM(){

    const keyword=document

    .getElementById("search")

    .value

    .toLowerCase();

    const hasil=dataSPM.filter(item=>{

        return item.nomor

        .toLowerCase()

        .includes(keyword);

    });

    renderHasil(hasil);

};

function renderHasil(list){
;
    const tbody=document

    .getElementById("tableSPM");

    tbody.innerHTML="";

    list.forEach((spm,index)=>{

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

        `;

    });

}
/*====================================================
UPLOAD
====================================================*/

function uploadFile(index,drppIndex,spbyIndex){

    alert(

    "Nanti akan membuka Upload Google Drive"

    );

}

/*====================================================
VIEW
====================================================*/

function viewFile(index,drppIndex,spbyIndex){

    alert(

    "Nanti akan membuka Preview PDF"

    );

}

/*====================================================
DOWNLOAD
====================================================*/

function downloadFile(index,drppIndex,spbyIndex){

    alert(

    "Nanti akan mendownload file"

    );

}

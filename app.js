// ============================
// DATA SEMENTARA
// ============================

let currentSPJ = null;

// ============================
// MODAL
// ============================

function openModal(spm, total, drpp, spby, kwitansi, suratTugas){

    currentSPJ = {
        spm,
        total,
        drpp,
        spby,
        kwitansi,
        suratTugas
    };

    document.getElementById("modalTitle").innerHTML =
        "Detail " + spm;

    document.getElementById("modalBody").innerHTML = `
        <p><strong>Nomor SPM :</strong> ${spm}</p>
        <p><strong>Total :</strong> Rp ${total}</p>

        <hr><br>

        <p><strong>DRPP</strong></p>
        <ul>
            ${drpp.map(item=>`<li>${item}</li>`).join("")}
        </ul>

        <br>

        <p><strong>SPBY</strong></p>
        <p>${spby}</p>

        <br>

        <p><strong>Kwitansi</strong></p>
        <p>${kwitansi}</p>

        <br>

        <p><strong>Surat Tugas</strong></p>

        <ul>
            ${suratTugas.map(item=>`<li>${item}</li>`).join("")}
        </ul>
    `;

    document.getElementById("spjModal").style.display="block";
}

// ============================

function closeModal(){

    document.getElementById("spjModal").style.display="none";

}

// ============================

window.onclick=function(event){

    let modal=document.getElementById("spjModal");

    if(event.target==modal){

        closeModal();

    }

}

// ============================
// SEARCH
// ============================

function searchTable(){

    let input=document.getElementById("searchInput");

    let filter=input.value.toUpperCase();

    let table=document.querySelector("table");

    let tr=table.getElementsByTagName("tr");

    for(let i=1;i<tr.length;i++){

        let txt=tr[i].textContent||tr[i].innerText;

        if(txt.toUpperCase().indexOf(filter)>-1){

            tr[i].style.display="";

        }else{

            tr[i].style.display="none";

        }

    }

}

// ============================
// PREVIEW PDF
// ============================

function previewFile(){

    alert(
        "Fitur Preview PDF akan dihubungkan dengan file PDF asli."
    );

}

// ============================
// DOWNLOAD ZIP
// ============================

function downloadZIP(){

    alert(
        "Fitur Download ZIP akan dihubungkan dengan file ZIP SPJ."
    );

}

// ============================
// LOADING
// ============================

document.addEventListener("DOMContentLoaded",()=>{

    console.log("Dashboard Monitoring SPJ Siap.");

});

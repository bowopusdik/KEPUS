let data = JSON.parse(localStorage.getItem("spj")) || [];

/* ===== SAVE SPJ ===== */
function saveSPJ(){

  let fileInput = document.getElementById("fileInput");
  let fileName = fileInput.files[0] ? fileInput.files[0].name : "-";

  let newData = {
    spm: document.getElementById("spm").value,
    total: document.getElementById("total").value,
    drpp: document.getElementById("drpp").value,
    spby: document.getElementById("spby").value,
    kw: document.getElementById("kw").value,
    st: document.getElementById("st").value,
    file: fileName
  };

  data.push(newData);
  localStorage.setItem("spj", JSON.stringify(data));

  render();
  closeForm();
}

/* ===== RENDER TABLE ===== */
function render(){

  let table = document.getElementById("tableBody");
  table.innerHTML = "";

  data.forEach((d,i)=>{

    table.innerHTML += `
      <tr>
        <td onclick="view(${i})">👁</td>
        <td>${d.spm}</td>
        <td>${d.total}</td>
        <td>${d.drpp}</td>
        <td>${d.spby}</td>
        <td>${d.kw}</td>
        <td>${d.file}</td>
        <td><button onclick="hapus(${i})">🗑</button></td>
      </tr>
    `;
  });
}

render();

/* ===== VIEW MODAL ===== */
function view(i){
  let d = data[i];

  document.getElementById("modalTitle").innerText = d.spm;

  document.getElementById("modalBody").innerHTML = `
    <p>Total: ${d.total}</p>
    <p>DRPP: ${d.drpp}</p>
    <p>SPBY: ${d.spby}</p>
    <p>KW: ${d.kw}</p>
    <p>File: ${d.file}</p>
  `;

  document.getElementById("modal").style.display="flex";
}

/* ===== DELETE ===== */
function hapus(i){
  data.splice(i,1);
  localStorage.setItem("spj", JSON.stringify(data));
  render();
}

/* ===== SEARCH REALTIME ===== */
function searchTable(){

  let input = document.getElementById("searchInput").value.toLowerCase();
  let rows = document.querySelectorAll("tbody tr");

  rows.forEach(row=>{
    row.style.display = row.innerText.toLowerCase().includes(input) ? "" : "none";
  });
}

/* ===== FORM ===== */
function openForm(){
  document.getElementById("formBox").style.display="block";
}

function closeForm(){
  document.getElementById("formBox").style.display="none";
}

/* ===== MODAL CLOSE ===== */
function closeModal(){
  document.getElementById("modal").style.display="none";
}

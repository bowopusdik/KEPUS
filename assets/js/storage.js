function getDataSPJ(){
  return JSON.parse(localStorage.getItem("dataSPJ")) || [];
}

function saveDataSPJ(data){
  localStorage.setItem("dataSPJ", JSON.stringify(data));
}

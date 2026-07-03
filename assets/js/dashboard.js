
function updateDashboard(){

  const data = getDataSPJ();

  let total = 0;

  data.forEach(item => {
    total += Number(item.nilaiSPJ || 0);
  });

  const menunggu = data.filter(x => (x.status || "Menunggu") === "Menunggu").length;
  const revisi = data.filter(x => x.status === "Revisi").length;
  const selesai = data.filter(x => x.status === "Selesai").length;

  document.getElementById("total").textContent = formatRupiah(total);
  document.getElementById("menunggu").textContent = menunggu;
  document.getElementById("revisi").textContent = revisi;
  document.getElementById("selesai").textContent = selesai;
}

updateDashboard();
setInterval(updateDashboard, 1000);

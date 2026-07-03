import Header from "../ui/Header";
import StatCard from "../ui/StatCard";
import SPJTable from "../ui/SPJTable";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">

      <Header />

      {/* STAT CARDS */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Terverifikasi" value="120 SPM" color="success" />
        <StatCard title="Revisi" value="35 SPM" color="warning" />
        <StatCard title="Belum" value="18 SPM" color="danger" />
        <StatCard title="Total" value="173 SPM" color="primary" />
      </div>

      {/* TABLE */}
      <SPJTable />

    </div>
  );
}

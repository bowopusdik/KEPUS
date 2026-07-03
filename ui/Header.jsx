export default function Header() {
  return (
    <div className="bg-white/70 backdrop-blur-md border-b border-spj-primary p-4 rounded-xl shadow-soft">

      <h1 className="text-xl font-bold text-spj-dark">
        📁 SISTEM ARSIP SPJ PERJALANAN DINAS
      </h1>

      <div className="flex gap-3 mt-3">
        <input
          placeholder="🔍 Search SPM / DRPP / SPBY / KWITANSI..."
          className="flex-1 px-4 py-2 rounded-lg border focus:outline-none"
        />

        <select className="px-3 py-2 rounded-lg border">
          <option>Filter</option>
        </select>

        <button className="bg-spj-primary text-white px-4 py-2 rounded-lg">
          + Tambah SPM
        </button>
      </div>
    </div>
  );
}

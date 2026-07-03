const data = [
  {
    spm: "SPM-001",
    total: "5.000.000",
    status: "success",
    drpp: "DRPP-01",
    spby: "SPBY-01",
    kwitansi: "KW-01",
    st: "ST-01",
  },
  {
    spm: "SPM-002",
    total: "3.500.000",
    status: "warning",
    drpp: "DRPP-02",
    spby: "SPBY-02",
    kwitansi: "KW-02",
    st: "ST-02",
  },
];

const statusColor = {
  success: "bg-spj-success",
  warning: "bg-spj-warning",
  danger: "bg-spj-danger",
};

export default function SPJTable() {
  return (
    <div className="bg-white rounded-xl shadow-soft overflow-hidden">
      
      <table className="w-full text-sm">
        <thead className="bg-spj-primary text-white">
          <tr>
            <th className="p-3">View</th>
            <th>Status</th>
            <th>SPM</th>
            <th>Total</th>
            <th>DRPP</th>
            <th>SPBY</th>
            <th>Kwitansi</th>
            <th>ST</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, i) => (
            <tr
              key={i}
              className="border-b hover:bg-blue-50 transition"
            >
              <td className="text-center">👁</td>

              <td className="text-center">
                <span
                  className={`text-white px-2 py-1 rounded-md text-xs ${
                    statusColor[item.status]
                  }`}
                >
                  ●
                </span>
              </td>

              <td>{item.spm}</td>
              <td>Rp {item.total}</td>
              <td>{item.drpp}</td>
              <td>{item.spby}</td>
              <td>{item.kwitansi}</td>
              <td>{item.st}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SPJModal({ open, onClose, data }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      
      <div className="bg-white rounded-xl p-6 w-[600px] shadow-modal">

        <h2 className="text-lg font-bold text-spj-dark">
          📊 DETAIL {data?.spm}
        </h2>

        <div className="mt-4 space-y-2 text-sm">
          <p>💰 Total: Rp {data?.total}</p>
          <p>DRPP: {data?.drpp}</p>
          <p>SPBY: {data?.spby}</p>
          <p>KWITANSI: {data?.kwitansi}</p>
          <p>ST: {data?.st}</p>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="bg-spj-primary text-white px-4 py-2 rounded-lg">
            Preview
          </button>
          <button className="bg-gray-200 px-4 py-2 rounded-lg">
            Download ZIP
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

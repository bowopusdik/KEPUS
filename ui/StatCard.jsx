const colorMap = {
  success: "text-spj-success",
  warning: "text-spj-warning",
  danger: "text-spj-danger",
  primary: "text-spj-primary",
};

export default function StatCard({ title, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-soft p-4 hover:-translate-y-1 transition">
      <p className={`font-semibold ${colorMap[color]}`}>{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}

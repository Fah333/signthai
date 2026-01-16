export default function Card({ title, value, icon: Icon }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">
      <div>
        <div className="text-gray-600 font-medium">{title}</div>
        <div className="text-3xl font-bold mt-2">{value}</div>
      </div>
      <Icon className="w-10 h-10 text-gray-400" />
    </div>
  );
}

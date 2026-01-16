const FeatureCard = ({ icon, title, desc }) => {
  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="text-blue-600 text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
};

export default FeatureCard;

const LessonCard = ({ image, title, desc }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg">
      <img src={image} alt={title} className="rounded mb-3 w-full h-40 object-cover" />
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
};

export default LessonCard;

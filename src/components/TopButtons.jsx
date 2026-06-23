const TopButtons = ({ setQuery }) => {
  const cities = [
    { id: 1, name: "Jaipur" },
    { id: 2, name: "Indore" },
    { id: 3, name: "Delhi" },
    { id: 4, name: "Toronto" },
    { id: 5, name: "Sydney" },
  ];

  return (
    <div className="flex items-center justify-around my-6">
      {cities.map((city) => (
        <button
          key={city.id}
          onClick={() => setQuery({ q: city.name })}
          className="text-lg font-medium hover:bg-orange-700/20 px-3 py-2 rounded-b-md transition ease-in"
        >
          {city.name}
        </button>
      ))}
    </div>
  );
};

export default TopButtons;
const TimeAndLocation = ({ weather }) => {
  const { formattedTime, name, country } = weather;

  return (
    <div>
      <div className="flex items-center justify-center my-6">
        <p className="text-xl font-extralight">{formattedTime}</p>
      </div>
      <div className="flex justify-center items-center my-3">
        <p className="text-3xl font-medium">
          {name}, {country}
        </p>
      </div>
    </div>
  );
};

export default TimeAndLocation;
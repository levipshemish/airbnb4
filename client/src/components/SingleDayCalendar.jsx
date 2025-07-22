import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SingleDayCalendar = ({ experience, selectedDate, setSelectedDate }) => {
  if (!experience) return null;

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Select Date</h2>

      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        className="border px-2 py-1 rounded w-full"
        placeholderText="Choose a day"
        dateFormat="MMMM d, yyyy"
        minDate={new Date()}
      />

      {selectedDate && (
        <div className="mt-4 text-sm">
          <p>Selected Date: {selectedDate.toLocaleDateString()}</p>
          <p className="font-semibold text-green-700">
            Price: ${experience.price}
          </p>
        </div>
      )}
    </div>
  );
};

export default SingleDayCalendar;

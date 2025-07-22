import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BookingCalendar = ({
  home,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  onBookNow,
}) => {
  if (!home) return null;

  const calculateNights = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const totalNights = calculateNights();
  const totalPrice = totalNights * home.price;

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Select Your Dates</h2>

      <div className="flex gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium">Check-in</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="border px-2 py-1 rounded w-full"
            placeholderText="Start Date"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Check-out</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="border px-2 py-1 rounded w-full"
            placeholderText="End Date"
          />
        </div>
      </div>

      <div className="mt-4 text-sm">
        {totalNights > 0 ? (
          <div>
            <p>{totalNights} night{totalNights > 1 ? 's' : ''}</p>
            <p className="font-semibold">Total Price: ${totalPrice}</p>
            {onBookNow && (
              <button
                onClick={() => onBookNow({ startDate, endDate, totalPrice })}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
              >
                Book Now
              </button>
            )}
          </div>
        ) : (
          <p>Select dates to see the price</p>
        )}
      </div>
    </div>
  );
};

export default BookingCalendar;

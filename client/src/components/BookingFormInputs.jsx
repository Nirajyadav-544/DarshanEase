import React from 'react';

const getSlotId = (slot) => {
  return slot?.slotId || slot?._id || '';
};

const getSlotSeats = (slot) => {
  const value =
    slot?.availableSeats !== undefined
      ? slot.availableSeats
      : slot?.available;

  const seats = Number(value);

  return Number.isFinite(seats) ? seats : 0;
};

const getSlotName = (slot) => {
  return slot?.time || slot?.slotName || 'Unknown slot';
};

export default function BookingFormInputs({
  bookingDate,
  setBookingDate,
  dateOptions,
  availableSlots,
  selectedSlot,
  setSelectedSlot,
  availabilityLoading,
  visitorPhone,
  setVisitorPhone,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <label
          htmlFor="bookingDate"
          className="block mb-2 text-sm font-bold text-gray-700"
        >
          📅 Select Booking Date
        </label>

        <select
          id="bookingDate"
          value={bookingDate}
          onChange={(event) =>
            setBookingDate(event.target.value)
          }
          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 font-mono text-xs font-bold focus:outline-none focus:border-orange-500"
        >
          {dateOptions.map((date) => (
            <option
              key={date.value}
              value={date.value}
            >
              {date.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="ticketSlot"
          className="block mb-2 text-sm font-bold text-gray-700"
        >
          ⏳ Select Ticket Slot
        </label>

        <select
          id="ticketSlot"
          value={getSlotId(selectedSlot)}
          disabled={
            availabilityLoading ||
            availableSlots.length === 0
          }
          onChange={(event) => {
            const nextSlot =
              availableSlots.find(
                (slot) =>
                  getSlotId(slot) === event.target.value
              ) || null;

            setSelectedSlot(nextSlot);
          }}
          className="w-full px-4 py-3 rounded-xl border text-sm bg-white text-gray-800 font-bold focus:outline-none focus:border-orange-500 disabled:bg-gray-100"
        >
          {availabilityLoading ? (
            <option value="">
              Loading availability...
            </option>
          ) : availableSlots.length === 0? (
            <option value="">
              No tickets available for this date
            </option>
          ) : (
            <>
              <option value="" disabled>
                Select a ticket slot
              </option>

              {availableSlots.map((slot) => {
                const slotId = getSlotId(slot);
                const seats = getSlotSeats(slot);
                const soldOut = seats <= 0;

                return (
                  <option
                    key={slotId}
                    value={slotId}
                    disabled={soldOut}
                  >
                    {getSlotName(slot)}{' '}
                    {soldOut
                      ? '[Sold Out - Locked]'
                      : `(${seats} Available)`}
                  </option>
                );
              })}
            </>
          )}
        </select>
      </div>

      <div className="md:col-span-2">
        <label
          htmlFor="visitorPhone"
          className="block mb-2 text-sm font-bold text-gray-700"
        >
          📱 Billing Phone
        </label>

        <input
          id="visitorPhone"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          required
          value={visitorPhone}
          onChange={(event) =>
            setVisitorPhone(
              event.target.value
                .replace(/\D/g, '')
                .slice(0, 10)
            )
          }
          placeholder="Primary phone number"
          className="w-full px-4 py-2.5 rounded-xl border text-sm bg-white text-gray-800 focus:outline-none focus:border-orange-500"
        />
      </div>
    </div>
  );
}
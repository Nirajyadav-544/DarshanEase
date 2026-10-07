import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import API from '../api/axios';
import DevoteeForm from '../components/DevoteeForm';
import BookingPriceSummary from '../components/BookingPriceSummary';
import BookingFormInputs from '../components/BookingFormInputs';

const DEFAULT_TEMPLE_ID = '6a666cf167fd606734340272';
const TICKET_PRICE = 250;

const EMPTY_DEVOTEE = {
  fullName: '',
  gender: 'Male',
  mobileNumber: '',
  province: '',
  district: '',
  nationality: 'Nepal',
  nationalIdentityNumber: '',
  address: '',
};

const getTodayISODate = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const getSlotId = (slot) => {
  return slot?.slotId || slot?._id || '';
};

const getSlotName = (slot) => {
  return slot?.time || slot?.slotName || 'Unknown time slot';
};

const DEFAULT_FALLBACK_SEATS = 999;

const getAvailableSeats = (slot) => {
  if (!slot) return 0;

  const candidates = [
    slot.availableSeats,
    slot.available,
    slot.remainingSeats,
    slot.seatsAvailable,
    slot.seatsLeft,
    slot.remaining,
    slot.capacity,
    slot.slotsAvailable,
  ];

  for (const candidate of candidates) {
    if (candidate !== undefined && candidate !== null) {
      const seats = Number(candidate);

      if (Number.isFinite(seats)) {
        return seats;
      }
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      'Booking: could not find a seat-count field on slot object — treating as available.',
      slot
    );
  }

  return DEFAULT_FALLBACK_SEATS;
};

export default function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const templeId =
    searchParams.get('templeId') || DEFAULT_TEMPLE_ID;

  const [bookingDate, setBookingDate] = useState(
    getTodayISODate()
  );

  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [visitorPhone, setVisitorPhone] = useState('');
  const [devotees, setDevotees] = useState([
    { ...EMPTY_DEVOTEE },
  ]);

  const [availabilityLoading, setAvailabilityLoading] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const totalAmount = devotees.length * TICKET_PRICE;

  const dateOptions = useMemo(() => {
    const dates = [];
    const baseDate = new Date();

    baseDate.setHours(0, 0, 0, 0);

    for (let index = 0; index < 30; index += 1) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + index);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      const value = `${year}-${month}-${day}`;

      dates.push({
        value,
        label: date.toLocaleDateString('en-IN', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
      });
    }

    return dates;
  }, []);

  /*
   * Date change होने पर पुरानी availability तुरंत clear होती है।
   * इसके बाद selected temple और selected date के आधार पर backend request जाती है।
   *
   * NOTE: यह असली API call है — किसी hardcoded "DEMO_TICKET_AVAILABILITY" /
   * fake "DEMO-<date>" slotId वाले block को दोबारा यहां मत लाना, वो
   * backend को पूरी तरह bypass कर देता है और booking हमेशा एक
   * non-existent slotId पर fail होती है ("Invalid slotId").
   */
  useEffect(() => {
    let requestCancelled = false;

    const fetchAvailability = async () => {
      setAvailabilityLoading(true);
      setAvailableSlots([]);
      setSelectedSlot(null);

      try {
        const response = await API.get(
          '/booking/availability',
          {
            params: {
              templeId,
              date: bookingDate,
            },
          }
        );

        if (requestCancelled) return;

        const serverSlots =
          response.data?.slotsAvailability ||
          response.data?.slots ||
          response.data?.availability ||
          response.data?.availableSlots ||
          response.data?.slotList ||
          response.data?.results ||
          response.data?.data ||
          [];

        const normalizedSlots = Array.isArray(serverSlots)
          ? serverSlots
          : [];

        setAvailableSlots(normalizedSlots);

        const firstAvailableSlot =
          normalizedSlots.find(
            (slot) => getAvailableSeats(slot) > 0
          ) || null;

        setSelectedSlot(firstAvailableSlot);
      } catch (error) {
        if (requestCancelled) return;

        console.error(
          'Availability request failed:',
          error
        );

        setAvailableSlots([]);
        setSelectedSlot(null);

        toast.error(
          error.response?.data?.message ||
            'Availability could not be loaded for this date.'
        );
      } finally {
        if (!requestCancelled) {
          setAvailabilityLoading(false);
        }
      }
    };

    if (templeId && bookingDate) {
      fetchAvailability();
    }

    return () => {
      requestCancelled = true;
    };
  }, [templeId, bookingDate]);

  const handleInputChange = (index, field, value) => {
    setDevotees((previousDevotees) =>
      previousDevotees.map((devotee, devoteeIndex) =>
        devoteeIndex === index
          ? {
              ...devotee,
              [field]: value,
            }
          : devotee
      )
    );
  };

  const handleAddDevotee = () => {
    setDevotees((previousDevotees) => [
      ...previousDevotees,
      { ...EMPTY_DEVOTEE },
    ]);
  };

  const handleRemoveDevotee = (index) => {
    setDevotees((previousDevotees) => {
      if (previousDevotees.length === 1) {
        return previousDevotees;
      }

      return previousDevotees.filter(
        (_, devoteeIndex) => devoteeIndex !== index
      );
    });
  };

  const handleProceedToPayment = async (event) => {
    event.preventDefault();

    let activeSlot = selectedSlot;

    if (!activeSlot) {
      activeSlot =
        availableSlots.find((slot) => getAvailableSeats(slot) > 0) ||
        null;

      if (activeSlot) {
        setSelectedSlot(activeSlot);
      }
    }

    if (!activeSlot) {
      toast.error(
        'No ticket time slots are available for the selected date.'
      );
      return;
    }

    const availableSeats = getAvailableSeats(activeSlot);

    if (availableSeats <= 0) {
      toast.error(
        'This ticket slot is sold out for the selected date.'
      );
      return;
    }

    if (devotees.length > availableSeats) {
      toast.error(
        `Only ${availableSeats} ticket(s) are available for ${bookingDate}.`
      );
      return;
    }

    if (!/^[0-9]{10}$/.test(visitorPhone)) {
      toast.error(
        'Please enter a valid 10-digit mobile number.'
      );
      return;
    }

    const hasInvalidDevotee = devotees.some(
      (devotee) => !devotee.fullName?.trim()
    );

    if (hasInvalidDevotee) {
      toast.error(
        'Please enter the name of every devotee.'
      );
      return;
    }

    setLoading(true);

    const toastId = toast.loading(
      'Confirming date-based ticket availability...'
    );

    try {
      const token = localStorage.getItem('token');

      const visitorName = devotees
        .map(
          (devotee, index) =>
            `[Devotee #${index + 1} -> Name: ${
              devotee.fullName.trim()
            }, Gender: ${
              devotee.gender || 'Not specified'
            }, Mobile: ${
              devotee.mobileNumber || visitorPhone
            }]`
        )
        .join(' | ');

      const generatedBookingId = `DARSHAN-${Date.now()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;

      const bookingPayload = {
        templeId,
        bookingDate,
        slotId: getSlotId(activeSlot),
        visitorName,
        visitorPhone: visitorPhone.trim(),
        numberOfPeople: devotees.length,
        amount: totalAmount,
        bookingId: generatedBookingId,
        bookingStatus: 'Confirmed',
        paymentStatus: 'Paid',
      };

      const response = await API.post(
        '/booking/create',
        bookingPayload,
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : undefined,
        }
      );

      if (
        response.status !== 201 &&
        response.data?.success !== true
      ) {
        throw new Error(
          'Booking was not confirmed by the server.'
        );
      }

      toast.success(
        'Ticket booking confirmed successfully.',
        { id: toastId }
      );

      const bookingId =
        response.data?.booking?._id ||
        response.data?.id ||
        generatedBookingId;

      navigate(`/ticket/${bookingId}`);
    } catch (error) {
      console.error('Booking failed:', error);

      toast.error(
        error.response?.data?.message ||
          'Booking failed. Availability may have changed.',
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedSlotSeats = getAvailableSeats(selectedSlot);

  const selectedSlotUnavailable =
    !selectedSlot || selectedSlotSeats <= 0;

  const selectedSlotName = selectedSlot
    ? getSlotName(selectedSlot)
    : '';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-left">
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100">

        {/* Date-specific live availability banner */}
        <div
          className={`mb-6 p-5 rounded-2xl border-2 transition-all ${
            availabilityLoading
              ? 'bg-blue-50 text-blue-700 border-blue-300 animate-pulse'
              : availableSlots.length === 0
              ? 'bg-gray-50 text-gray-600 border-gray-300'
              : selectedSlotUnavailable
              ? 'bg-red-50 text-red-700 border-red-300 animate-pulse'
              : selectedSlotSeats <= 5
              ? 'bg-amber-50 text-amber-700 border-amber-300'
              : 'bg-green-50 text-green-700 border-green-300'
          }`}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest">
                Live Date Availability
              </p>

              <p className="mt-2 text-sm font-bold">
                📅 Date:{' '}
                <span className="font-mono">
                  {bookingDate}
                </span>
              </p>

              {selectedSlot && (
                <p className="mt-1 text-sm font-bold">
                  ⏳ Slot:{' '}
                  <span className="font-mono">
                    {selectedSlotName}
                  </span>
                </p>
              )}
            </div>

            <div className="px-5 py-3 bg-white rounded-xl shadow text-center font-black font-mono">
              {availabilityLoading ? (
                <>
                  <div>🔄 LOADING</div>
                  <div className="text-xs mt-1">
                    Fetching selected date
                  </div>
                </>
              ) : availableSlots.length === 0 ? (
                <>
                  <div>⚠️ UNAVAILABLE</div>
                  <div className="text-xs mt-1">
                    No tickets for this date
                  </div>
                </>
              ) : selectedSlotUnavailable ? (
                <>
                  <div>❌ SOLD OUT</div>
                  <div className="text-xs mt-1">
                    0 available for selected slot
                  </div>
                </>
              ) : (
                <>
                  <div>
                    🟢 AVBL-{String(
                      selectedSlotSeats
                    ).padStart(4, '0')}
                  </div>
                  <div className="text-xs mt-1">
                    Tickets available
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <form
          onSubmit={handleProceedToPayment}
          className="space-y-6"
        >
          <BookingFormInputs
            bookingDate={bookingDate}
            setBookingDate={setBookingDate}
            dateOptions={dateOptions}
            availableSlots={availableSlots}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
            availabilityLoading={availabilityLoading}
            visitorPhone={visitorPhone}
            setVisitorPhone={setVisitorPhone}
          />

          <DevoteeForm
            devotees={devotees}
            handleInputChange={handleInputChange}
            handleRemoveDevotee={handleRemoveDevotee}
          />

          <button
            type="button"
            onClick={handleAddDevotee}
            className="border-2 border-dashed border-orange-300 text-orange-600 font-black w-full py-3.5 rounded-2xl hover:bg-orange-50 text-xs uppercase tracking-wide"
          >
            ➕ Add Another Devotee Member
          </button>

          <BookingPriceSummary
            count={devotees.length}
            price={TICKET_PRICE}
            totalAmount={totalAmount}
          />

          <button
            type="submit"
            disabled={
              loading ||
              availabilityLoading ||
              selectedSlotUnavailable
            }
            className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold rounded-2xl uppercase tracking-wider text-sm transition shadow-lg"
          >
            {loading
              ? 'Processing Registration...'
              : availabilityLoading
              ? 'Loading Availability...'
              : selectedSlotUnavailable
              ? '❌ SOLD OUT / UNAVAILABLE'
              : '💡 Confirm & Proceed To Pass Generation →'}
          </button>
        </form>
      </div>
    </div>
  );
}
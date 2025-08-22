// src/components/schedule/schedule.js - UPDATED WITH YOUR REQUIREMENTS
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './schedule.css';

// Helper Functions & Constants
const API_BASE_URL =
  process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';

// UPDATED TIME SLOTS BASED ON YOUR AVAILABILITY
const WEEKDAY_TIME_SLOTS = [
  '09:00 AM', // Morning slots
  '10:00 AM',
  '11:00 AM',
  '05:00 PM', // Evening slots
  '06:00 PM',
  '07:00 PM',
];

const WEEKEND_TIME_SLOTS = [
  '09:00 AM', // All day available on weekends
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
  '07:00 PM',
];

const SUNDAY_TIME_SLOTS = [
  '11:00 AM', // Available after 11am on Sunday
  '12:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
  '07:00 PM',
];

// MEETING SUBJECTS OPTIONS
const MEETING_SUBJECTS = [
  { value: 'consultation', label: 'Free Consultation', duration: 30 },
  { value: 'project-discussion', label: 'Project Discussion', duration: 45 },
  {
    value: 'technical-review',
    label: 'Technical Review/Code Review',
    duration: 60,
  },
  { value: 'career-guidance', label: 'Career Guidance', duration: 30 },
  { value: 'collaboration', label: 'Business Collaboration', duration: 45 },
  { value: 'follow-up', label: 'Follow-up Meeting', duration: 15 },
  { value: 'other', label: 'Other (Please specify in message)', duration: 30 },
];

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Helper function to get available time slots based on day
const getTimeSlots = (dateString) => {
  const date = new Date(dateString);
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

  if (dayOfWeek === 0) {
    // Sunday
    return SUNDAY_TIME_SLOTS;
  } else if (dayOfWeek === 6) {
    // Saturday
    return WEEKEND_TIME_SLOTS;
  } else {
    // Weekdays (Monday-Friday)
    return WEEKDAY_TIME_SLOTS;
  }
};

// Calendar-specific date formatting
const formatDateForCalendar = (year, month, day) => {
  const date = new Date(year, month, day);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// API date formatting
const formatDateForAPI = (dateString) => {
  try {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  } catch (error) {
    return dateString;
  }
};

// Display date formatting
const formatDateForDisplay = (dateString) => {
  try {
    const dateParts = dateString.split('-');
    if (dateParts.length === 3) {
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1;
      const day = parseInt(dateParts[2]);

      const dateObj = new Date(year, month, day);

      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    return dateString;
  } catch (error) {
    return dateString;
  }
};

// Status Message Component
const StatusMessage = ({ type, message }) => {
  if (!message) return null;
  return <div className={`status-message ${type}`}>{message}</div>;
};

// Main Schedule Component
const Schedule = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('consultation');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Get current time slots based on selected date
  const currentTimeSlots = useMemo(() => {
    if (!selectedDate) return [];
    return getTimeSlots(selectedDate);
  }, [selectedDate]);

  // Get selected meeting subject details
  const selectedMeetingDetails = useMemo(() => {
    return (
      MEETING_SUBJECTS.find((subject) => subject.value === selectedSubject) ||
      MEETING_SUBJECTS[0]
    );
  }, [selectedSubject]);

  // Fetch availability when a date is selected
  useEffect(() => {
    if (!selectedDate) {
      setBookedSlots([]);
      return;
    }

    const fetchAvailability = async () => {
      setAvailabilityLoading(true);
      setError(null);
      try {
        const formattedDate = formatDateForAPI(selectedDate);
        const response = await fetch(
          `${API_BASE_URL}/api/schedule/availability?date=${formattedDate}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch availability.');
        }
        const result = await response.json();
        const unavailableSlots = result.unavailableSlots || result;
        setBookedSlots(Array.isArray(unavailableSlots) ? unavailableSlots : []);
      } catch (err) {
        setError('Could not load available times. Please try again.');
        setBookedSlots([]);
      } finally {
        setAvailabilityLoading(false);
      }
    };

    fetchAvailability();
  }, [selectedDate]);

  // Calendar generation logic - UPDATED TO ALLOW WEEKENDS
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days = [];

    const today = new Date();
    const todayDateString = formatDateForCalendar(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ key: `empty-${i}`, isEmpty: true });
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDateForCalendar(year, month, day);
      const dayDate = new Date(year, month, day);

      const isPast = dayDate < today && dateString !== todayDateString;
      const isToday = dateString === todayDateString;

      // ALL DAYS ARE NOW AVAILABLE (weekends included)
      const isAvailable = !isPast;

      days.push({
        key: day,
        day,
        dateString: dateString,
        isAvailable,
        isPast,
        isToday,
      });
    }

    return days;
  }, [currentMonth]);

  // Event Handlers
  const handleDateSelect = (day) => {
    if (!day.isAvailable) return;

    setSelectedDate(day.dateString);
    setSelectedTime('');
    setError(null);
    setSuccess(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  const navigateMonth = useCallback((direction) => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedDate || !selectedTime || !formData.name || !formData.email) {
      setError('Please fill out all required fields and select a date/time.');
      return;
    }

    const apiFormattedDate = formatDateForAPI(selectedDate);
    const displayFormattedDate = formatDateForDisplay(selectedDate);

    const bookingData = {
      ...formData,
      date: apiFormattedDate,
      time: selectedTime,
      meetingType: selectedSubject,
      subject: selectedMeetingDetails.label,
      timezone: 'UTC+05:30',
    };

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/schedule/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Booking failed.');
      }

      setSuccess(
        `Meeting booked for ${selectedTime} on ${displayFormattedDate}! Confirmation sent.`
      );

      setSelectedDate('');
      setSelectedTime('');
      setSelectedSubject('consultation');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="schedule" className="schedule-section">
      <div className="schedule-container">
        <div className="schedule-header">
          <h2>Schedule a Meeting</h2>
          <p>
            Choose your preferred time and let me know what you'd like to
            discuss.
          </p>
        </div>

        <StatusMessage type="error" message={error} />
        <StatusMessage type="success" message={success} />

        <div className="scheduler-grid">
          <div className="date-time-picker">
            <h3>1. Select Date & Time</h3>
            <div className="calendar">
              <div className="calendar-header">
                <button
                  onClick={() => navigateMonth(-1)}
                  aria-label="Previous month"
                  type="button"
                >
                  &lt;
                </button>
                <span>
                  {MONTH_NAMES[currentMonth.getMonth()]}{' '}
                  {currentMonth.getFullYear()}
                </span>
                <button
                  onClick={() => navigateMonth(1)}
                  aria-label="Next month"
                  type="button"
                >
                  &gt;
                </button>
              </div>
              <div className="calendar-grid">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
                  <div key={d} className="day-name">
                    {d}
                  </div>
                ))}
                {calendarDays.map((day) =>
                  day.isEmpty ? (
                    <div key={day.key}></div>
                  ) : (
                    <button
                      key={day.key}
                      className={`day-btn ${
                        selectedDate === day.dateString ? 'selected' : ''
                      } ${day.isToday ? 'today' : ''}`}
                      onClick={() => handleDateSelect(day)}
                      disabled={!day.isAvailable}
                      type="button"
                      title={
                        day.isAvailable
                          ? `Select ${formatDateForDisplay(day.dateString)}`
                          : day.isPast
                          ? 'Past date'
                          : 'Not available'
                      }
                    >
                      {day.day}
                      {day.isToday && (
                        <span className="today-indicator">Today</span>
                      )}
                    </button>
                  )
                )}
              </div>
            </div>

            {selectedDate && (
              <div className="time-slots">
                <h4>
                  Available Times for {formatDateForDisplay(selectedDate)}
                </h4>
                <div className="availability-info">
                  <p>
                    {(() => {
                      const date = new Date(selectedDate);
                      const dayOfWeek = date.getDay();
                      if (dayOfWeek === 0)
                        return 'Sunday: Available after 11:00 AM';
                      if (dayOfWeek === 6) return 'Saturday: Available all day';
                      return 'Weekday: Morning (9-11 AM) & Evening (5-7 PM) slots';
                    })()}
                  </p>
                </div>
                <div className="time-slots-grid">
                  {currentTimeSlots.map((time) => {
                    const isBooked = bookedSlots.includes(time);
                    return (
                      <button
                        key={time}
                        className={`time-slot-btn ${
                          selectedTime === time ? 'selected' : ''
                        }`}
                        onClick={() => setSelectedTime(time)}
                        disabled={isBooked || availabilityLoading}
                        type="button"
                        title={
                          isBooked
                            ? 'This time slot is already booked'
                            : `Select ${time}`
                        }
                      >
                        {availabilityLoading ? '...' : time}
                        {isBooked && (
                          <span className="booked-indicator"> (Booked)</span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {availabilityLoading && (
                  <p className="loading-message">Checking availability...</p>
                )}
              </div>
            )}
          </div>

          <div className="booking-details">
            <h3>2. Your Details</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="subject">Meeting Subject *</label>
                <select
                  id="subject"
                  name="subject"
                  value={selectedSubject}
                  onChange={handleSubjectChange}
                  required
                  className="form-input"
                >
                  {MEETING_SUBJECTS.map((subject) => (
                    <option key={subject.value} value={subject.value}>
                      {subject.label} ({subject.duration} min)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Your full name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message (Optional)</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  className="form-input"
                  placeholder="Tell me about your project or any specific topics you'd like to discuss..."
                />
              </div>

              {selectedDate && selectedTime && (
                <div className="booking-summary">
                  <h4>📅 Booking Summary</h4>
                  <p>
                    <strong>Date:</strong> {formatDateForDisplay(selectedDate)}
                  </p>
                  <p>
                    <strong>Time:</strong> {selectedTime} (UTC+05:30)
                  </p>
                  <p>
                    <strong>Duration:</strong> {selectedMeetingDetails.duration}{' '}
                    minutes
                  </p>
                  <p>
                    <strong>Subject:</strong> {selectedMeetingDetails.label}
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting || !selectedTime || !selectedDate}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    Scheduling Meeting...
                  </>
                ) : (
                  'Schedule Meeting'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Schedule;

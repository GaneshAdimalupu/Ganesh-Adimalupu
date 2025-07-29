// components/schedule/schedule.js
import React, { useState, useEffect } from 'react';
import './schedule.css';

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [meetingType, setMeetingType] = useState('consultation');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    timezone: 'UTC+05:30'
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableDates, setAvailableDates] = useState([]);

  // Available time slots
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  // Meeting types
  const meetingTypes = [
    { value: 'consultation', label: 'Free Consultation (30 min)', icon: '💬' },
    { value: 'project-discussion', label: 'Project Discussion (45 min)', icon: '📋' },
    { value: 'technical-review', label: 'Technical Review (60 min)', icon: '🔧' },
    { value: 'follow-up', label: 'Follow-up Meeting (15 min)', icon: '📞' }
  ];

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];
    const today = new Date();

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < today;
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      days.push({
        day,
        date: date.toISOString().split('T')[0],
        isToday,
        isPast,
        isWeekend,
        isAvailable: !isPast && !isWeekend
      });
    }

    return days;
  };

  const handleDateSelect = (date) => {
    if (date.isAvailable) {
      setSelectedDate(date.date);
      setSelectedTime(''); // Reset time when date changes
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time for your meeting.');
      return;
    }

    const meetingData = {
      ...formData,
      date: selectedDate,
      time: selectedTime,
      meetingType,
      timestamp: new Date().toISOString()
    };

    // Here you would typically send to your backend or calendar API
    console.log('Meeting scheduled:', meetingData);

    // For demo, show success message
    alert(`Meeting scheduled successfully!\n\nDate: ${selectedDate}\nTime: ${selectedTime}\nType: ${meetingTypes.find(t => t.value === meetingType).label}\n\nYou'll receive a confirmation email shortly.`);

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      message: '',
      timezone: 'UTC+05:30'
    });
    setSelectedDate('');
    setSelectedTime('');
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <section id="schedule" className="section">
      <div className="container">
        <h2>Schedule a Meeting</h2>
        <p className="section-text">
          Book a free consultation to discuss your project ideas, get technical advice,
          or explore how we can work together to bring your vision to life.
        </p>

        <div className="schedule-content">
          {/* Meeting Types */}
          <div className="meeting-types">
            <h3>Select Meeting Type</h3>
            <div className="meeting-type-grid">
              {meetingTypes.map((type) => (
                <button
                  key={type.value}
                  className={`meeting-type-card ${meetingType === type.value ? 'selected' : ''}`}
                  onClick={() => setMeetingType(type.value)}
                >
                  <span className="meeting-icon">{type.icon}</span>
                  <span className="meeting-label">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="schedule-grid">
            {/* Calendar */}
            <div className="calendar-section">
              <h3>Select Date</h3>
              <div className="calendar">
                <div className="calendar-header">
                  <button
                    className="nav-btn"
                    onClick={() => navigateMonth(-1)}
                  >
                    ‹
                  </button>
                  <h4>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h4>
                  <button
                    className="nav-btn"
                    onClick={() => navigateMonth(1)}
                  >
                    ›
                  </button>
                </div>

                <div className="calendar-days-header">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="day-header">{day}</div>
                  ))}
                </div>

                <div className="calendar-days">
                  {calendarDays.map((date, index) => (
                    <div
                      key={index}
                      className={`calendar-day ${
                        date ? (
                          date.isAvailable ? 'available' :
                          date.isPast ? 'past' :
                          date.isWeekend ? 'weekend' : ''
                        ) : 'empty'
                      } ${selectedDate === date?.date ? 'selected' : ''}`}
                      onClick={() => date && handleDateSelect(date)}
                    >
                      {date?.day}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Time Slots */}
            <div className="time-section">
              <h3>Select Time</h3>
              {selectedDate ? (
                <div className="time-slots">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="select-date-first">Please select a date first</p>
              )}
            </div>
          </div>

          {/* Booking Form */}
          {selectedDate && selectedTime && (
            <div className="booking-form">
              <h3>Complete Your Booking</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name *"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email *"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="company"
                      placeholder="Company (Optional)"
                      value={formData.company}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleInputChange}
                  >
                    <option value="UTC+05:30">India Standard Time (UTC+05:30)</option>
                    <option value="UTC+00:00">UTC (UTC+00:00)</option>
                    <option value="UTC-05:00">Eastern Time (UTC-05:00)</option>
                    <option value="UTC-08:00">Pacific Time (UTC-08:00)</option>
                  </select>
                </div>

                <div className="form-group">
                  <textarea
                    name="message"
                    placeholder="Brief description of what you'd like to discuss..."
                    rows="4"
                    value={formData.message}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <div className="booking-summary">
                  <h4>Meeting Summary</h4>
                  <div className="summary-item">
                    <span>Type:</span>
                    <span>{meetingTypes.find(t => t.value === meetingType).label}</span>
                  </div>
                  <div className="summary-item">
                    <span>Date:</span>
                    <span>{new Date(selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="summary-item">
                    <span>Time:</span>
                    <span>{selectedTime} ({formData.timezone})</span>
                  </div>
                </div>

                <button type="submit" className="cta-button">
                  Schedule Meeting
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Schedule;

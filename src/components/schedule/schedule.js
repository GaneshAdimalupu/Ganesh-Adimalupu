// components/schedule/schedule.js - FIXED VERSION FOR VERCEL
import React, { useState, useEffect } from 'react';
import './schedule.css';

const Schedule = () => {
  // State management
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
  const [bookedSlots, setBookedSlots] = useState([]);

  // Enhanced loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successDetails, setSuccessDetails] = useState(null);

  // FIXED: Proper API URL configuration for Vercel
  const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? '' // Empty string means same domain in production (Vercel)
    : 'http://localhost:5000';

  // Available time slots
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  // Meeting types with durations
  const meetingTypes = [
    { value: 'consultation', label: 'Free Consultation (30 min)', icon: '💬', duration: 30 },
    { value: 'project-discussion', label: 'Project Discussion (45 min)', icon: '📋', duration: 45 },
    { value: 'technical-review', label: 'Technical Review (60 min)', icon: '🔧', duration: 60 },
    { value: 'follow-up', label: 'Follow-up Meeting (15 min)', icon: '📞', duration: 15 }
  ];

  // FIXED: Enhanced availability fetching with proper error handling
  useEffect(() => {
    if (selectedDate) {
      const fetchAvailability = async () => {
        setAvailabilityLoading(true);
        setError(null);

        try {
          console.log('🔍 Fetching availability for:', selectedDate);
          console.log('🌐 API Base URL:', API_BASE_URL);

          // FIXED: Proper URL construction for Vercel
          const apiUrl = `${API_BASE_URL}/api/schedule/availability?date=${selectedDate}`;
          console.log('📡 Full API URL:', apiUrl);

          const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
          });

          console.log('📊 Response status:', response.status);
          console.log('📊 Response ok:', response.ok);

          if (!response.ok) {
            let errorMessage = `HTTP ${response.status}`;
            try {
              const errorData = await response.json();
              errorMessage = errorData.message || errorData.error || errorMessage;
            } catch (parseError) {
              console.log('Could not parse error response');
            }
            throw new Error(errorMessage);
          }

          const unavailableSlots = await response.json();
          console.log('📅 Unavailable slots received:', unavailableSlots);

          // Ensure we have an array
          const slotsArray = Array.isArray(unavailableSlots) ? unavailableSlots : [];
          setBookedSlots(slotsArray);

        } catch (error) {
          console.error("❌ Failed to fetch availability:", error);

          // FIXED: Better error messaging for different scenarios
          let errorMessage = 'Failed to load availability';

          if (error.message.includes('fetch')) {
            errorMessage = 'Connection error. Please check your internet connection.';
          } else if (error.message.includes('404')) {
            errorMessage = 'API endpoint not found. Please check deployment.';
          } else if (error.message.includes('500')) {
            errorMessage = 'Server error. Please try again later.';
          } else {
            errorMessage = `Error: ${error.message}`;
          }

          setError(errorMessage);
          setBookedSlots([]);
        } finally {
          setAvailabilityLoading(false);
        }
      };

      fetchAvailability();
    }
  }, [selectedDate, API_BASE_URL]);

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === new Date().toDateString();
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
      setSelectedTime('');
      setError(null);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear errors when user makes changes
  };

  // Enhanced form validation
  const validateForm = () => {
    const errors = [];

    if (!selectedDate) errors.push('Please select a date');
    if (!selectedTime) errors.push('Please select a time');
    if (!formData.name.trim()) errors.push('Name is required');
    if (!formData.email.trim()) errors.push('Email is required');

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    return errors;
  };

  // FIXED: Enhanced submit function with proper URL handling
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous states
    setError(null);
    setSuccessDetails(null);

    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }

    setIsLoading(true);

    const meetingData = {
      ...formData,
      date: selectedDate,
      time: selectedTime,
      meetingType
    };

    console.log('🚀 Submitting enhanced booking:', meetingData);

    try {
      // Step 1: Checking availability
      setLoadingMessage('Checking availability...');
      await new Promise(resolve => setTimeout(resolve, 500)); // Brief pause for UX

      // Step 2: Creating booking
      setLoadingMessage('Creating your booking...');

      // FIXED: Proper URL construction for booking endpoint
      const bookingUrl = `${API_BASE_URL}/api/schedule/book`;
      console.log('📡 Booking URL:', bookingUrl);

      const response = await fetch(bookingUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(meetingData),
      });

      console.log('📊 Booking response status:', response.status);

      const result = await response.json();
      console.log('📋 Enhanced response:', result);

      if (!response.ok) {
        throw new Error(result.message || result.error || `Server error: ${response.status}`);
      }

      // Step 3: Processing additional services
      if (result.services) {
        if (result.services.calendar?.status === 'success') {
          setLoadingMessage('Adding to Google Calendar...');
          await new Promise(resolve => setTimeout(resolve, 800));
        }

        if (result.services.email?.status === 'success') {
          setLoadingMessage('Sending confirmation email...');
          await new Promise(resolve => setTimeout(resolve, 600));
        }
      }

      // Success!
      console.log('✅ Enhanced booking successful!');
      setSuccessDetails(result);

      // Show detailed success message
      let successMessage = `✅ Meeting scheduled successfully!\n\n`;
      successMessage += `📅 ${new Date(selectedDate).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      })}\n`;
      successMessage += `⏰ ${selectedTime} (${formData.timezone})\n`;
      successMessage += `🎯 ${meetingTypes.find(t => t.value === meetingType)?.label}\n\n`;

      if (result.services?.calendar?.status === 'success') {
        successMessage += `📅 Calendar event created\n`;
      }
      if (result.services?.email?.status === 'success') {
        successMessage += `📧 Confirmation email sent\n`;
      }

      successMessage += `\nBooking ID: ${result.booking?.id}`;

      alert(successMessage);

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
      setBookedSlots([]);

    } catch (error) {
      console.error('❌ Enhanced booking failed:', error);

      let errorMessage = 'Failed to schedule meeting.\n\n';

      if (error.message.includes('Time slot unavailable')) {
        errorMessage += '⏰ This time slot was just booked by someone else.\nPlease select a different time.';
      } else if (error.message.includes('fetch')) {
        errorMessage += '🌐 Connection error. Please check:\n';
        errorMessage += '• Your internet connection\n';
        errorMessage += '• API endpoints are working\n';
        errorMessage += '• No firewall blocking the request';
      } else if (error.message.includes('404')) {
        errorMessage += '🔍 API endpoint not found.\n';
        errorMessage += 'This might be a deployment configuration issue.';
      } else {
        errorMessage += `Error: ${error.message}`;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const calendarDays = generateCalendarDays();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <section id="schedule" className="section">
      <div className="container">
        <h2>Schedule a Meeting</h2>
        <p className="section-text">
          Book a consultation with integrated Google Calendar and email confirmations.
          Select your preferred time and receive instant confirmation.
        </p>

        {/* FIXED: Enhanced Status Display with better debugging info */}
        <div className="status-bar">
          <div className="status-item">
            <span className="status-icon">🖥️</span>
            <span>Environment: {process.env.NODE_ENV || 'development'}</span>
          </div>
          <div className="status-item">
            <span className="status-icon">🌐</span>
            <span>API: {API_BASE_URL || 'Same Domain'}</span>
          </div>
          <div className="status-item">
            <span className="status-icon">📅</span>
            <span>Google Calendar: Enabled</span>
          </div>
          <div className="status-item">
            <span className="status-icon">📧</span>
            <span>Email Notifications: Enabled</span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-message">
            <div className="error-icon">⚠️</div>
            <div className="error-text">{error}</div>
            <button className="error-close" onClick={() => setError(null)}>×</button>
          </div>
        )}

        {/* Success Details Display */}
        {successDetails && (
          <div className="success-message">
            <div className="success-icon">🎉</div>
            <div className="success-text">
              <strong>Booking Confirmed!</strong>
              <div className="success-details">
                <div>📅 Calendar: {successDetails.services?.calendar?.status === 'success' ? '✅' : '⚠️'}</div>
                <div>📧 Email: {successDetails.services?.email?.status === 'success' ? '✅' : '⚠️'}</div>
                <div>⏱️ Processing: {successDetails.processingTime}</div>
              </div>
            </div>
            <button className="success-close" onClick={() => setSuccessDetails(null)}>×</button>
          </div>
        )}

        <div className="schedule-content">
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
            <div className="calendar-section">
              <h3>Select Date</h3>
              <div className="calendar">
                <div className="calendar-header">
                  <button className="nav-btn" onClick={() => navigateMonth(-1)}>‹</button>
                  <h4>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h4>
                  <button className="nav-btn" onClick={() => navigateMonth(1)}>›</button>
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
                          date.isAvailable ? 'available' : date.isPast ? 'past' : date.isWeekend ? 'weekend' : ''
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

            <div className="time-section">
              <h3>
                Select Time
                {availabilityLoading && <span className="loading-spinner">⟳</span>}
              </h3>
              {selectedDate ? (
                <div className="time-slots">
                  {timeSlots.map((time) => {
                    const isBooked = bookedSlots.includes(time);
                    return (
                      <button
                        key={time}
                        className={`time-slot ${selectedTime === time ? 'selected' : ''} ${isBooked ? 'booked' : ''} ${availabilityLoading ? 'loading' : ''}`}
                        onClick={() => !isBooked && !availabilityLoading && setSelectedTime(time)}
                        disabled={isBooked || availabilityLoading}
                      >
                        {isBooked ? `${time} (Booked)` : time}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="select-date-first">Please select a date first</p>
              )}
            </div>
          </div>

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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="company"
                      placeholder="Company (Optional)"
                      value={formData.company}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleInputChange}
                    disabled={isLoading}
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
                    disabled={isLoading}
                  ></textarea>
                </div>

                <div className="booking-summary">
                  <h4>Meeting Summary</h4>
                  <div className="summary-item">
                    <span>Type:</span>
                    <span>{meetingTypes.find(t => t.value === meetingType)?.label}</span>
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
                  <div className="summary-item">
                    <span>Duration:</span>
                    <span>{meetingTypes.find(t => t.value === meetingType)?.duration} minutes</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`cta-button ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading-content">
                      <span className="spinner">⟳</span>
                      {loadingMessage || 'Processing...'}
                    </span>
                  ) : (
                    <span>📅 Schedule Meeting</span>
                  )}
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

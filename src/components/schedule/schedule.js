import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './schedule.css';

// --- Helper Functions & Constants ---
const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';
const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // Full day names for unique keys

// --- Child Components ---

const StatusMessage = ({ type, message }) => {
    if (!message) return null;
    return <div className={`status-message ${type}`}>{message}</div>;
};

// --- Main Schedule Component ---

const Schedule = () => {
    // State Management
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [bookedSlots, setBookedSlots] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    // UI State
    const [availabilityLoading, setAvailabilityLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

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
                console.log('🔍 Fetching availability for:', selectedDate);
                const response = await fetch(`${API_BASE_URL}/api/schedule/availability?date=${selectedDate}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch availability: ${response.status} ${response.statusText}`);
                }

                const unavailableSlots = await response.json();
                console.log('📊 Unavailable slots:', unavailableSlots);
                setBookedSlots(Array.isArray(unavailableSlots) ? unavailableSlots : []);
            } catch (err) {
                console.error('❌ Availability fetch error:', err);
                setError('Could not load available times. Please try again or contact directly.');
                setBookedSlots([]);
            } finally {
                setAvailabilityLoading(false);
            }
        };

        fetchAvailability();
    }, [selectedDate]);

    // Calendar generation logic, memoized for performance
    const calendarDays = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const days = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push({
                key: `empty-${month}-${i}`, // More specific key
                isEmpty: true
            });
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isPast = date < today;
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            days.push({
                key: `${year}-${month}-${day}`, // Unique key with year-month-day
                day,
                dateString: date.toISOString().split('T')[0],
                isAvailable: !isPast && !isWeekend,
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
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const navigateMonth = useCallback((direction) => {
        setCurrentMonth(prev => {
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

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setIsSubmitting(true);
        try {
            console.log('🎯 Submitting booking request');
            const response = await fetch(`${API_BASE_URL}/api/schedule/book`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    date: selectedDate,
                    time: selectedTime,
                    meetingType: 'consultation',
                    timezone: 'UTC+05:30'
                }),
            });

            const result = await response.json();
            console.log('📧 Booking response:', result);

            if (!response.ok) {
                throw new Error(result.message || result.error || 'Booking failed');
            }

            setSuccess(`🎉 Meeting booked successfully for ${selectedTime} on ${selectedDate}! You'll receive a confirmation email shortly.`);

            // Reset form
            setSelectedDate('');
            setSelectedTime('');
            setFormData({ name: '', email: '', message: '' });

        } catch (err) {
            console.error('❌ Booking submission failed:', err);

            let errorMessage = 'Failed to book meeting. ';
            if (err.message.includes('timeout')) {
                errorMessage += 'Connection timeout - please try again or contact me directly.';
            } else if (err.message.includes('fetch')) {
                errorMessage += 'Connection error - please check your internet and try again.';
            } else {
                errorMessage += err.message || 'Please try again later.';
            }

            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="schedule" className="schedule-section">
            <div className="schedule-container">
                <div className="schedule-header">
                    <h2>Schedule a Meeting</h2>
                    <p>Select a date and time to book a free 30-minute consultation.</p>
                </div>

                <StatusMessage type="error" message={error} />
                <StatusMessage type="success" message={success} />

                <div className="scheduler-grid">
                    <div className="date-time-picker">
                        <h3>1. Select Date & Time</h3>
                        <div className="calendar">
                            <div className="calendar-header">
                                <button onClick={() => navigateMonth(-1)} aria-label="Previous month">&lt;</button>
                                <span>{MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
                                <button onClick={() => navigateMonth(1)} aria-label="Next month">&gt;</button>
                            </div>
                            <div className="calendar-grid">
                                {DAY_NAMES.map((dayName, index) => (
                                    <div key={`dayname-${index}`} className="day-name">{dayName[0]}</div>
                                ))}
                                {calendarDays.map(day => (
                                    day.isEmpty ?
                                    <div key={day.key}></div> :
                                    <button
                                        key={day.key}
                                        className={`day-btn ${selectedDate === day.dateString ? 'selected' : ''}`}
                                        onClick={() => handleDateSelect(day)}
                                        disabled={!day.isAvailable}
                                        aria-label={`Select ${day.day} ${MONTH_NAMES[currentMonth.getMonth()]}`}
                                    >
                                        {day.day}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedDate && (
                            <div className="time-slots">
                                <h4>Available Times ({selectedDate})</h4>
                                {availabilityLoading ? (
                                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                                        <div className="spinner"></div>
                                        <p>Loading available times...</p>
                                    </div>
                                ) : (
                                    <div className="time-slots-grid">
                                        {TIME_SLOTS.map(time => {
                                            const isBooked = bookedSlots.includes(time);
                                            return (
                                                <button
                                                    key={`time-${selectedDate}-${time}`}
                                                    className={`time-slot-btn ${selectedTime === time ? 'selected' : ''}`}
                                                    onClick={() => setSelectedTime(time)}
                                                    disabled={isBooked}
                                                    aria-label={`${time} ${isBooked ? 'unavailable' : 'available'}`}
                                                >
                                                    {time} {isBooked && '(Booked)'}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="booking-details">
                        <h3>2. Your Details</h3>
                        <form onSubmit={handleSubmit}>
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
                                    disabled={isSubmitting}
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
                                    disabled={isSubmitting}
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
                                    disabled={isSubmitting}
                                    placeholder="What would you like to discuss? (Optional)"
                                />
                            </div>

                            {selectedDate && selectedTime && (
                                <div style={{
                                    background: 'rgba(76, 201, 240, 0.1)',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    marginBottom: '1rem',
                                    border: '1px solid rgba(76, 201, 240, 0.2)'
                                }}>
                                    <h4 style={{ color: 'var(--glow-cyan)', margin: '0 0 0.5rem 0' }}>📅 Meeting Summary</h4>
                                    <p style={{ margin: '0', color: 'var(--text-primary)' }}>
                                        <strong>Date:</strong> {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}<br/>
                                        <strong>Time:</strong> {selectedTime} (IST - UTC+05:30)<br/>
                                        <strong>Duration:</strong> 30 minutes<br/>
                                        <strong>Type:</strong> Free Consultation Call
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
                                        <span>Booking Meeting...</span>
                                    </>
                                ) : (
                                    <span>📅 Schedule Meeting</span>
                                )}
                            </button>
                        </form>

                        {/* Contact alternative */}
                        <div style={{
                            marginTop: '2rem',
                            padding: '1rem',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '8px',
                            textAlign: 'center'
                        }}>
                            <p style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                                Having trouble? Contact me directly:
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                <a
                                    href="mailto:ganeshadimalupu@disroot.org?subject=Meeting Request"
                                    style={{ color: 'var(--glow-cyan)', fontSize: '0.9rem' }}
                                >
                                    📧 Email
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/GaneshAdimalupu/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: 'var(--glow-cyan)', fontSize: '0.9rem' }}
                                >
                                    💼 LinkedIn
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Schedule;

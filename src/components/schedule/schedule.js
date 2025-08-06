import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './schedule.css';

// Helper Functions & Constants
const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';
const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Status Message Component
const StatusMessage = ({ type, message }) => {
    if (!message) return null;
    return <div className={`status-message ${type}`}>{message}</div>;
};

// Main Schedule Component
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
                const response = await fetch(`${API_BASE_URL}/api/schedule/availability?date=${selectedDate}`);
                if (!response.ok) throw new Error('Failed to fetch availability.');
                const unavailableSlots = await response.json();
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

    // Calendar generation logic, memoized for performance
    const calendarDays = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const days = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < firstDayOfMonth; i++) days.push({ key: `empty-${i}`, isEmpty: true });

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isPast = date < today;
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            days.push({
                key: day,
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

        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/schedule/book`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, date: selectedDate, time: selectedTime, meetingType: 'consultation' }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Booking failed.');

            setSuccess(`Meeting booked for ${selectedTime} on ${selectedDate}! Confirmation sent.`);
            setSelectedDate('');
            setSelectedTime('');
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
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="day-name">{d}</div>)}
                                {calendarDays.map(day => (
                                    day.isEmpty ? <div key={day.key}></div> :
                                    <button
                                        key={day.key}
                                        className={`day-btn ${selectedDate === day.dateString ? 'selected' : ''}`}
                                        onClick={() => handleDateSelect(day)}
                                        disabled={!day.isAvailable}
                                    >
                                        {day.day}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedDate && (
                            <div className="time-slots">
                                <div className="time-slots-grid">
                                    {TIME_SLOTS.map(time => {
                                        const isBooked = bookedSlots.includes(time);
                                        return (
                                            <button
                                                key={time}
                                                className={`time-slot-btn ${selectedTime === time ? 'selected' : ''}`}
                                                onClick={() => setSelectedTime(time)}
                                                disabled={isBooked || availabilityLoading}
                                            >
                                                {time}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="booking-details">
                        <h3>2. Your Details</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className="form-input" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="form-input" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Message (Optional)</label>
                                <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} rows="4" className="form-input"></textarea>
                            </div>
                            <button type="submit" className="submit-btn" disabled={isSubmitting || !selectedTime}>
                                {isSubmitting ? <><div className="spinner"></div><span>Booking...</span></> : 'Schedule Meeting'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Schedule;

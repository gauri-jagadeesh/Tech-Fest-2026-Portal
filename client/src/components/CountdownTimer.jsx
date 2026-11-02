import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate = '2026-03-15T09:00:00' }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      // If date has passed, show fixed showcase numbers
      timeLeft = { days: 42, hours: 14, minutes: 28, seconds: 55 };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const pad = (num) => String(num).padStart(2, '0');

  return (
    <div className="countdown-container">
      <div className="countdown-box">
        <div className="countdown-num text-gradient">{pad(timeLeft.days)}</div>
        <div className="countdown-label">Days</div>
      </div>
      <div className="countdown-box">
        <div className="countdown-num text-gradient">{pad(timeLeft.hours)}</div>
        <div className="countdown-label">Hours</div>
      </div>
      <div className="countdown-box">
        <div className="countdown-num text-gradient">{pad(timeLeft.minutes)}</div>
        <div className="countdown-label">Minutes</div>
      </div>
      <div className="countdown-box">
        <div className="countdown-num text-gradient">{pad(timeLeft.seconds)}</div>
        <div className="countdown-label">Seconds</div>
      </div>
    </div>
  );
};

export default CountdownTimer;

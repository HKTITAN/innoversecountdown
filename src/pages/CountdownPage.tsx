import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import '../styles.css';
import logos from '../assets/logos.svg';
import innoverseLogo from '../assets/innoverse-logo.svg';
import partners from '../assets/partners.svg';
import QuoteDisplay from './Quote';

const CountdownPage: React.FC = () => {
  const [countdown, setCountdown] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    console.log("Connecting to socket.io server...");
    const socket = io('https://countdown-timer-em6a-fkgahixo0-aditya-kalias-projects.vercel.app');

    socket.on('connect', () => {
      console.log('Connected to server! Socket ID:', socket.id);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from server. Reason:', reason);
    });

    socket.on('countdown-update', (data) => {
      console.log('Received countdown-update:', data);
      setCountdown(data.countdown);
      setIsPaused(data.isPaused);
    });

    return () => {
      socket.disconnect();
      console.log("Client manually disconnecting");
    };
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const hoursDisplay = Math.floor(countdown / 3600).toString().padStart(2, '0');
  const minutesDisplay = Math.floor((countdown % 3600) / 60).toString().padStart(2, '0');
  const secondsDisplay = (countdown % 60).toString().padStart(2, '0');

  return (
    <div className="container">
      <img src={logos} alt="Event Logos" className="logos" />
      <img src={innoverseLogo} alt="Innoverse Logo" className="logo" />
      <div className="countdown">
        {isPaused ? (
          <div className="coming-soon">Starting Soon(-_-)</div>
        ) : (
          <>
            <div className="time-block">
              <span id="hours">{hoursDisplay}</span>
              <span className="label">Hours</span>
            </div>
            <div className="time-block">
              <span id="minutes">{minutesDisplay}</span>
              <span className="label">Minutes</span>
            </div>
            <div className="time-block">
              <span id="seconds">{secondsDisplay}</span>
              <span className="label">Seconds</span>
            </div>
          </>
        )}
      </div>

      <QuoteDisplay />
      <h2 className="event-date">Current Time (IST): {formattedTime}</h2>
      <img src={partners} alt="Event Partners" className="partners" />
    </div>
  );
};

export default CountdownPage;
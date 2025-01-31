import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from './socket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn, faClock, faCog, faDesktop, faInfoCircle, faPause, faPlay, faRedo, faSync } from '@fortawesome/free-solid-svg-icons';

const AdminPage: React.FC = () => {
  const [durationHours, setDurationHours] = useState(0);
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementSuccess, setAnnouncementTextSuccess] = useState(false);
  const [announcementDuration, setAnnouncementDuration] = useState(10);
  const [connectedClients, setConnectedClients] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClientConnected = (clientId: string) => {
      setConnectedClients((prevClients) => [...prevClients, clientId]);
    };

    const handleClientDisconnected = (clientId: string) => {
      setConnectedClients((prevClients) => prevClients.filter((id) => id !== clientId));
    };

    const handleConnectedClientsList = (clients: string[]) => {
      setConnectedClients(clients);
    };

    socket.on('client-connected', handleClientConnected);
    socket.on('client-disconnected', handleClientDisconnected);
    socket.on('connected-clients-list', handleConnectedClientsList);

    socket.emit('get-connected-clients');

    return () => {
      socket.off('client-connected', handleClientConnected);
      socket.off('client-disconnected', handleClientDisconnected);
      socket.off('connected-clients-list', handleConnectedClientsList);
    };
  }, []);

  const handleStart = () => {
    const totalSeconds = (durationHours * 3600) + (durationMinutes * 60) + durationSeconds;
    console.log('Starting countdown with duration (seconds):', totalSeconds);
    socket.emit('start-countdown', totalSeconds);
  };

  const handlePause = () => {
    socket.emit('pause-countdown');
  };

  const handleResume = () => {
    socket.emit('resume-countdown');
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const handleBroadcast = () => {
    if (announcementText.trim() !== "") {
      socket.emit('broadcast-announcement', {
        message: announcementText,
        duration: announcementDuration,
      });
      setAnnouncementText("");
      setAnnouncementTextSuccess(true);
      setTimeout(() => setAnnouncementTextSuccess(false), 3000);
    } else {
      alert("Please Enter the message to broadcast");
    }
  };

  return (
    <div id="adminPanel" className="admin-container" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '10px' }}>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div style={{ flex: 1 }}>
        <h1><FontAwesomeIcon icon={faCog} />Innoverse Control Panel</h1>
        <div className="admin-controls">
          <button id="startButton" onClick={handleStart}>
            <FontAwesomeIcon icon={faPlay} /> Start Countdown
          </button>
          <button id="pauseButton" onClick={handlePause}>
            <FontAwesomeIcon icon={faPause} /> Pause
          </button>
          <button id="resetButton" onClick={handleResume}>
            <FontAwesomeIcon icon={faRedo} /> Resume
          </button>
        </div>

        <div className="custom-time-section">
          <h2><FontAwesomeIcon icon={faClock} /> Set Time</h2>
          <div className="time-inputs">
            <div>
              <input
                type="text"
                id="hours"
                placeholder="Hours"
                value={durationHours === 0 ? '' : durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
              />
            </div>
            <div>
              <input
                type="text"
                id="minutes"
                placeholder="minutes"
                value={durationMinutes === 0 ? '' : durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
              />
            </div>
            <div>
              <input
                type="text"
                id="seconds"
                placeholder="seconds"
                value={durationSeconds === 0 ? '' : durationSeconds}
                onChange={(e) => setDurationSeconds(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="announcement-section">
          <h2><FontAwesomeIcon icon={faBullhorn} /> Broadcast Announcement</h2>
          <div className="announcement-controls">
            <input
              type="text"
              id="announcementText"
              placeholder="Enter announcement message"
              maxLength={200}
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
            />
            <div className="announcement-duration">
              <input
                type="number"
                id="announcementDuration"
                placeholder="Duration (seconds)"
                min="5"
                max="60"
                value={announcementDuration}
                onChange={(e) => setAnnouncementDuration(parseInt(e.target.value))}
              />
              <span> seconds</span>
            </div>
            <button onClick={handleBroadcast}>
              <FontAwesomeIcon icon={faBullhorn} /> Broadcast
            </button>
          </div>
          <p id="announcementStatus" className="status-message" style={{ color: announcementSuccess ? '#4CAF50' : 'inherit' }}>
            {announcementSuccess && <span>Announcement broadcasted!</span>}
          </p>
          <small>Announcement will be displayed on all active countdown screens</small>
        </div>


        <div className="viewers-section">
          <h2><FontAwesomeIcon icon={faDesktop} /> Active Viewers</h2>
          <div className="viewers-list" id="viewersList">
            {connectedClients.length === 0 ? (
              <div className="no-viewers">No active viewers connected</div>
            ) : (
              <ul>
                {connectedClients.map((clientId) => (
                  <li key={clientId}>{clientId}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="viewer-actions">
            <button onClick={() => window.location.reload()}>
              <FontAwesomeIcon icon={faSync} /> Refresh List
            </button>
          </div>
        </div>

        <div className="admin-status">
          <p><FontAwesomeIcon icon={faInfoCircle} /> Control the countdown timer from here. Changes will be reflected immediately on all viewer pages.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
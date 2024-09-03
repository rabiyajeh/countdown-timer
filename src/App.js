import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaRedo, FaBell } from 'react-icons/fa';
import Switch from 'react-switch';

function App() {
  const [timeLeft, setTimeLeft] = useState(60);
  const [duration, setDuration] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [radius, setRadius] = useState(150);

  useEffect(() => {
    const updateRadius = () => {
      const newRadius = window.innerWidth < 500 ? 100 : 150;
      setRadius(newRadius);
    };

    window.addEventListener('resize', updateRadius);
    updateRadius();

    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0) {
      playSound();
    }
  }, [timeLeft, isRunning]);

  const playSound = () => {
    const audio = new Audio('/sound/notification.mp3'); // Add your sound file in the public folder
    audio.play();
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const calculateStrokeDashoffset = () => {
    const totalLength = 2 * Math.PI * radius;
    return totalLength - (timeLeft / duration) * totalLength;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration);
  };

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleDurationChange = (event) => {
    const newDuration = parseInt(event.target.value, 10) * 60;
    setDuration(newDuration);
    setTimeLeft(newDuration);
  };

  return (
    <div style={theme === 'dark' ? styles.containerDark : styles.containerLight}>
      <div style={{ ...styles.circleContainer, width: 2 * radius, height: 2 * radius }}>
        <svg width={2 * radius} height={2 * radius} viewBox={`0 0 ${2 * radius} ${2 * radius}`}>
          <circle
            cx={radius}
            cy={radius}
            r={radius - 10}
            fill="transparent"
            stroke={theme === 'dark' ? '#ddd' : '#ccc'}
            strokeWidth="20"
          />
          <circle
            cx={radius}
            cy={radius}
            r={radius - 10}
            fill="transparent"
            stroke={theme === 'dark' ? '#61dafb' : '#007BFF'}
            strokeWidth="20"
            strokeDasharray={2 * Math.PI * radius}
            strokeDashoffset={calculateStrokeDashoffset()}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <h1 style={styles.timer}>{formatTime(timeLeft)}</h1>
      </div>
      <div style={styles.controls}>
        <button onClick={handleStartPause} style={styles.button}>
          {isRunning ? <FaPause /> : <FaPlay />}
        </button>
        <button onClick={handleReset} style={styles.button}>
          <FaRedo />
        </button>
      </div>
      <p style={styles.message}>
        {timeLeft === 0 ? <FaBell /> : isRunning ? 'Counting down...' : 'Paused'}
      </p>
      <div style={styles.settings}>
        <label htmlFor="duration" style={styles.label}>Set Duration (minutes):</label>
        <input
          id="duration"
          type="number"
          value={duration / 60}
          onChange={handleDurationChange}
          min="1"
          max="120"
          style={styles.input}
        />
      </div>
      <div style={styles.themeSwitch}>
        <label style={styles.label}>Dark Theme</label>
        <Switch onChange={handleThemeToggle} checked={theme === 'dark'} />
      </div>
    </div>
  );
}

const styles = {
  containerDark: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#282c34',
    color: '#61dafb',
    fontFamily: '"Roboto", sans-serif',
  },
  containerLight: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
    color: '#007BFF',
    fontFamily: '"Roboto", sans-serif',
  },
  circleContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timer: {
    position: 'absolute',
    fontSize: '4rem',
    fontWeight: 'bold',
    margin: '0',
  },
  controls: {
    display: 'flex',
    marginTop: '20px',
  },
  button: {
    backgroundColor: '#61dafb',
    color: '#282c34',
    border: 'none',
    borderRadius: '50%',
    padding: '10px',
    margin: '0 10px',
    cursor: 'pointer',
    fontSize: '1.5rem',
  },
  message: {
    fontSize: '1.5rem',
    marginTop: '20px',
  },
  settings: {
    marginTop: '20px',
  },
  label: {
    fontSize: '1rem',
    marginRight: '10px',
  },
  input: {
    padding: '5px',
    fontSize: '1rem',
  },
  themeSwitch: {
    marginTop: '20px',
    display: 'flex',
    alignItems: 'center',
  },
};

export default App;

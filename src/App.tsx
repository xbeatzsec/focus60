import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  // States for timer control
  const [timeLeft, setTimeLeft] = useState(60 * 60) // Remaining time in seconds
  const [isRunning, setIsRunning] = useState(false) // Timer running state
  const [isBreak, setIsBreak] = useState(false) // Break mode state
  const [focusTime, setFocusTime] = useState(25) // Focus time in minutes
  const [breakTime, setBreakTime] = useState(5) // Break time in minutes
  
  // States for input control
  const [focusInput, setFocusInput] = useState('60') // Focus input value
  const [breakInput, setBreakInput] = useState('5') // Break input value
  
  // States for statistics
  const [cycles, setCycles] = useState(0) // Number of completed cycles
  const [totalFocusTime, setTotalFocusTime] = useState(0) // Total focus time in minutes
  
  // References for audio system
  const audioContext = useRef<AudioContext | null>(null)
  const oscillator = useRef<OscillatorNode | null>(null)
  const gainNode = useRef<GainNode | null>(null)

  // Initialize audio system and request permissions
  useEffect(() => {
    // Create audio context
    audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    gainNode.current = audioContext.current.createGain()
    gainNode.current.gain.value = 0.5 // Volume at 50%
    gainNode.current.connect(audioContext.current.destination)

    // Request notification permission
    if (Notification.permission !== 'granted') {
      Notification.requestPermission()
    }

    // Cleanup resources on component unmount
    return () => {
      if (oscillator.current) {
        oscillator.current.stop()
      }
      if (audioContext.current) {
        audioContext.current.close()
      }
    }
  }, [])

  // Manage timer countdown
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval)
            setIsRunning(false)
            playNotification()
            if (!isBreak) {
              setTotalFocusTime(prev => prev + focusTime)
              setCycles(prev => prev + 1)
            }
            return isBreak ? focusTime * 60 : breakTime * 60
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isRunning, timeLeft, isBreak, focusTime, breakTime])

  // Function to play notification sound and show visual notification
  const playNotification = () => {
    // Play notification sound
    if (audioContext.current && gainNode.current) {
      if (audioContext.current.state === 'suspended') {
        audioContext.current.resume()
      }

      // Create and configure sound
      oscillator.current = audioContext.current.createOscillator()
      oscillator.current.type = 'sine'
      oscillator.current.frequency.setValueAtTime(880, audioContext.current.currentTime)
      oscillator.current.connect(gainNode.current)
      oscillator.current.start()

      // Gradually decrease sound frequency
      oscillator.current.frequency.exponentialRampToValueAtTime(440, audioContext.current.currentTime + 0.5)
      oscillator.current.stop(audioContext.current.currentTime + 0.5)
    }

    // Show visual notification
    if (Notification.permission === 'granted') {
      new Notification(isBreak ? 'Focus Time!' : 'Break Time!', {
        body: isBreak 
          ? `Time to focus for ${focusTime} minutes!` 
          : `Time to take a break for ${breakTime} minutes!`,
        icon: '/favicon.svg'
      })
    }
  }

  // Format time for display (MM:SS)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Adjust focus or break time
  const adjustTime = (type: 'focus' | 'break', increment: boolean) => {
    if (type === 'focus') {
      const newTime = increment ? focusTime + 1 : focusTime - 1
      if (newTime >= 1 && newTime <= 60) {
        setFocusTime(newTime)
        setFocusInput(newTime.toString())
        if (!isBreak) {
          setTimeLeft(newTime * 60)
        }
      }
    } else {
      const newTime = increment ? breakTime + 1 : breakTime - 1
      if (newTime >= 1 && newTime <= 30) {
        setBreakTime(newTime)
        setBreakInput(newTime.toString())
        if (isBreak) {
          setTimeLeft(newTime * 60)
        }
      }
    }
  }

  // Handle time input via keyboard
  const handleTimeInput = (type: 'focus' | 'break', value: string, e?: React.KeyboardEvent<HTMLInputElement>) => {
    const numValue = parseInt(value)
    if (type === 'focus') {
      setFocusInput(value)
      if (numValue >= 1 && numValue <= 60) {
        setFocusTime(numValue)
        if (!isBreak) {
          setTimeLeft(numValue * 60)
          // Start timer if Enter is pressed
          if (e?.key === 'Enter') {
            setIsRunning(true)
          }
        }
      }
    } else {
      setBreakInput(value)
      if (numValue >= 1 && numValue <= 30) {
        setBreakTime(numValue)
        if (isBreak) {
          setTimeLeft(numValue * 60)
          // Start timer if Enter is pressed
          if (e?.key === 'Enter') {
            setIsRunning(true)
          }
        }
      }
    }
  }

  // Toggle between focus and break mode
  const toggleMode = () => {
    setIsBreak(!isBreak)
    setTimeLeft(isBreak ? focusTime * 60 : breakTime * 60)
    setIsRunning(false)
  }

  // Reset timer to initial time
  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(isBreak ? breakTime * 60 : focusTime * 60)
  }

  return (
    <div className="app">
      <h1>Pomodoro Timer</h1>
      
      {/* Main timer display */}
      <div className={`timer ${isRunning ? 'running' : ''} ${isBreak ? 'break' : ''}`}>
        {formatTime(timeLeft)}
      </div>

      {/* Timer controls */}
      <div className="controls">
        <button onClick={() => setIsRunning(!isRunning)} disabled={timeLeft === 0}>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button onClick={resetTimer}>Reset</button>
        <button onClick={toggleMode}>
          {isBreak ? 'Focus Mode' : 'Break Mode'}
        </button>
      </div>

      {/* Time controls */}
      <div className="time-control">
        <div className="time-input">
          <label>Focus Time (min)</label>
          <div className="input-group">
            <button onClick={() => adjustTime('focus', false)}>-</button>
            <input
              type="number"
              value={focusInput}
              onChange={(e) => handleTimeInput('focus', e.target.value)}
              onKeyDown={(e) => handleTimeInput('focus', focusInput, e)}
              min="1"
              max="60"
            />
            <button onClick={() => adjustTime('focus', true)}>+</button>
          </div>
        </div>

        <div className="time-input">
          <label>Break Time (min)</label>
          <div className="input-group">
            <button onClick={() => adjustTime('break', false)}>-</button>
            <input
              type="number"
              value={breakInput}
              onChange={(e) => handleTimeInput('break', e.target.value)}
              onKeyDown={(e) => handleTimeInput('break', breakInput, e)}
              min="1"
              max="30"
            />
            <button onClick={() => adjustTime('break', true)}>+</button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats">
        <div className="stat-item">
          <span className="stat-label">Cycles Completed:</span>
          <span className="stat-value">{cycles}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Focus Time:</span>
          <span className="stat-value">{totalFocusTime} min</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        Developed by <a href="https://github.com/hbento" target="_blank" rel="noopener noreferrer">Hernani Bento</a>
      </footer>
    </div>
  )
}

export default App

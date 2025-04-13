# Pomodoro Timer

A modern, user-friendly Pomodoro Timer application built with React and TypeScript. This application helps you manage your time effectively using the Pomodoro Technique, which alternates between focused work periods and short breaks.

## Features

- ⏱️ **Customizable Timer**
  - Set focus time (1-60 minutes)
  - Set break time (1-30 minutes)
  - Start, pause, and reset functionality
  - Visual countdown display

- 📊 **Statistics Tracking**
  - Count completed Pomodoro cycles
  - Track total focus time
  - Real-time updates

- 🔔 **Notifications**
  - Audio notifications when timer ends
  - Desktop notifications (with permission)
  - Visual mode indicators (Focus/Break)

- 🎨 **Modern UI**
  - Clean, minimalist design
  - Dark theme
  - Responsive layout
  - Smooth animations

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hbento/pomodoro_test.git
```

2. Navigate to the project directory:
```bash
cd pomodoro_test
```

3. Install dependencies:
```bash
npm install
# or
yarn install
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open your browser and visit `http://localhost:5173`

## Usage

### Timer Controls

1. **Set Time**
   - Use the +/- buttons or type directly in the input fields
   - Focus time: 1-60 minutes
   - Break time: 1-30 minutes
   - Press Enter to start the timer after setting time

2. **Timer Actions**
   - Click "Start" to begin the countdown
   - Click "Pause" to pause the timer
   - Click "Reset" to reset to initial time
   - Click "Focus Mode"/"Break Mode" to switch between modes

### Notifications

1. **Enable Notifications**
   - Allow notifications when prompted by the browser
   - Audio notifications will play when the timer ends
   - Desktop notifications will show timer status

## Technical Details

### Built With

- React
- TypeScript
- Vite
- CSS3
- Web Audio API

### Project Structure

```
pomodoro_test/
├── public/
│   ├── favicon.svg
│   └── sounds/
│       └── notification.mp3
├── src/
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Made with ❤️ by [Hernani Bento](https://github.com/hbento)

## Acknowledgments

- The Pomodoro Technique was developed by Francesco Cirillo
- Icons and sounds used in this project are free for commercial use

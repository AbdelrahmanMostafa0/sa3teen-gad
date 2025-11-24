# Sa3teen Gad (ساعتين جد) 🚀

> **Your personal productivity companion for focused work, prayer times, and healthy habits.**

![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwind-css)

**Sa3teen Gad** (ساعتين جد - "Two Hours of Serious Work") is a productivity web application designed to help you stay focused and balanced throughout your workday. Built with Arabic speakers in mind, it combines the Pomodoro technique, task management, Islamic prayer times, and wellness reminders in a beautiful RTL interface.

> ⚠️ **Status**: This app is currently under active development. Some features are planned but not yet implemented.

---

## ✨ Current Features

### 🍅 Pomodoro Timer
- **Focus sessions** with customizable duration (default: 25 minutes)
- **Short breaks** to recharge (default: 5 minutes)
- Audio notifications when timers complete
- Auto-switch between focus and break modes
- Visual timer display with start/pause/reset controls

### ✅ Task Management
- Create, edit, and delete tasks
- Mark tasks as completed
- Persistent storage using localStorage
- Clean, minimal task interface
- Support for task descriptions and timestamps

### 🕌 Prayer Times
- Automatic Islamic prayer times based on your location
- Displays all 6 prayer times: Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha
- Powered by [Aladhan Prayer Times API](https://aladhan.com/prayer-times-api)
- Localized in Arabic with 12-hour format
- Configurable city and country settings

### 💧 Water Reminder
- Configurable reminder intervals (default: 20 minutes)
- Browser notifications and visual popups
- Audio alerts to keep you hydrated
- Can be toggled on/off in settings
- Beautiful animated popup with custom graphics

### ⚙️ Settings
- Customize Pomodoro and break durations
- Configure water reminder intervals
- Set your location for accurate prayer times
- Toggle auto-start features
- Persistent settings storage

---

## 🔮 Planned Features

- 📅 **Meeting Mode** - Pause all timers with one click
- ⏱ **Time Worked Tracker** - Track your daily work hours
- 📊 **Analytics Dashboard** - Visual breakdown of productivity stats
- 🌙 **Long Break Timer** - Extended breaks after multiple Pomodoro sessions
- 🔔 **Prayer Notifications** - Get notified before prayer times

---

## 🛠️ Technology Stack

### Core
- **[Next.js 15.3.3](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Redux Toolkit](https://redux-toolkit.js.org/)** - State management

### Styling & UI
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Motion](https://motion.dev/)** - Animation library
- **[React Icons](https://react-icons.github.io/react-icons/)** - Icon library
- **IBM Plex Sans Arabic** - Beautiful Arabic typography

### Utilities
- **[date-fns](https://date-fns.org/)** - Date manipulation and formatting
- **[Axios](https://axios-http.com/)** - HTTP client for API requests
- **[nanoid](https://github.com/ai/nanoid)** - Unique ID generation
- **[React Hook Form](https://react-hook-form.com/)** - Form management

---

## 📁 Project Structure

```
sa3teen-gad/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── navbar/           # Navigation and settings
│   │   ├── pomodoro/         # Timer components
│   │   ├── prayers/          # Prayer times display
│   │   ├── reminders/        # Water reminder
│   │   ├── tasks/            # Task management
│   │   └── ui/               # Shared UI components
│   ├── store/                # Redux state management
│   │   ├── features/         # Redux slices
│   │   └── store.ts          # Store configuration
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript definitions
│   ├── utils/                # Utility functions
│   ├── services/             # API services
│   ├── context/              # React Context providers
│   └── data/                 # Static data
├── public/                   # Static assets
│   ├── fonts/               # Custom fonts
│   ├── sound/               # Audio files
│   └── ...                  # Images and icons
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 20.x or higher
- **npm** or **yarn** package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/AbdelrahmanMostafa0/sa3teen-gad.git

# Navigate to the project directory
cd sa3teen-gad

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

### Build for Production

```bash
# Create an optimized production build
npm run build

# Start the production server
npm start
```

---

## 🎯 How to Use

1. **Set Your Location**: Click the settings icon to configure your city and country for accurate prayer times
2. **Start a Pomodoro**: Choose between Focus mode or Break mode, then click start
3. **Manage Tasks**: Add tasks using the input field, mark them complete, or delete them
4. **Stay Hydrated**: Enable water reminders in settings and get periodic notifications
5. **Track Prayer Times**: View all daily prayer times at the top of the page

---

## 🌍 Localization

The app is built with Arabic speakers in mind:
- **RTL (Right-to-Left) layout** for natural Arabic reading
- **Arabic interface** with localized text
- **Arabic date and time formatting**
- **IBM Plex Sans Arabic** font for beautiful typography

---

## 🤝 Contributing

Contributions are welcome! This project is under active development, and there are many features to implement and improvements to make.

### Areas for Contribution
- Implementing planned features (Meeting Mode, Analytics, Time Tracker)
- Adding tests (unit tests, integration tests)
- Improving accessibility (ARIA labels, keyboard navigation)
- Enhancing error handling and loading states
- Adding internationalization (i18n) support
- Performance optimizations

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Prayer times powered by [Aladhan API](https://aladhan.com/)
- Icons from [React Icons](https://react-icons.github.io/react-icons/)
- Fonts from [Google Fonts](https://fonts.google.com/)

---

## 📧 Contact

**Abdelrahman Mostafa**  
GitHub: [@AbdelrahmanMostafa0](https://github.com/AbdelrahmanMostafa0)

---

<div align="center">
  <p>ساعتين شاي وكوباية جد وكله هيبقى تمام 🍵</p>
</div>

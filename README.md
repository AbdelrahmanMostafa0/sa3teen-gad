<p align="center">
  <img src="public/banners/readme-banner.png" alt="Sa3teen Gad Banner" width="100%">
</p>

# Sa3teen Gad (ساعتين جد) 🚀

> **Your personal productivity companion for focused work, prayer times, and healthy habits.**

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
- Displays all 5 prayer times: Fajr, Dhuhr, Asr, Maghrib, Isha
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

### 🌙 Long Break Timer

- Extended breaks after multiple Pomodoro sessions
- Configurable long break duration
- Helps prevent burnout with scheduled longer rest periods

### 🔔 Prayer Notifications

- Get notified before prayer times
- Customizable reminder intervals (5, 10, 15 minutes before)
- Individual toggles for each prayer
- Audio and visual notifications
- Dedicated settings page for prayer reminders

### 👤 Guest User Handling

The application provides a seamless experience for visitors without requiring immediate registration.

- **Mechanism**: A unique `guestId` is generated and tracked for non-authenticated users.
- **Data Isolation**: Tasks and settings are securely associated with this ID, ensuring guests only see their own data.
- **Implementation Details**: The backend automatically switches contexts based on authentication status.

```typescript
// Backend logic to switch between User ID and Guest ID
export function getAuthContext(req: AuthenticatedRequest) {
  const { userId, guestId } = req.user;
  // Prioritize registered userId, fallback to guestId
  const authId = userId ? { userId } : { guestId };
  return { userId, guestId, authId };
}
```

### 🔢 Drag & Drop Implementation

I use **Fractional Indexing** to handle task reordering efficiently. This allows to update the position of a single task without needing to re-index the entire list.

- **How it works**: Every task has a floating-point `order` value.
- **Reordering**: When a task is moved, its new `order` is calculated based on its new neighbors.
  - **Between two tasks**: Average of the two neighbors' orders.
  - **At the top**: High-ranking neighbor + buffer (e.g., 10000).
  - **At the bottom**: Low-ranking neighbor / 2.
- **Performance**: This results in O(1) writes for reordering operations, making it highly scalable.

```typescript
// Logic to calculate the new order index
let newOrder: number;
if (prevOrder !== null && nextOrder !== null) {
  // Insert between two tasks: use midpoint
  newOrder = (prevOrder + nextOrder) / 2;
} else if (nextOrder !== null) {
  // Insert at the top (before the current first task)
  newOrder = nextOrder + 10000;
} else if (prevOrder !== null) {
  // Insert at the bottom (after the current last task)
  newOrder = prevOrder / 2;
}
```

---

## 🔮 Planned Features

- 📅 **Meeting Mode** - Pause all timers with one click
- ⏱ **Time Worked Tracker** - Track your daily work hours
- 📊 **Analytics Dashboard** - Visual breakdown of productivity stats

---

## 🛠️ Technology Stack

### Core

- **[Next.js 16.0.10](https://nextjs.org/)** - React framework with App Router
- **[React 19.2.1](https://react.dev/)** - UI library
- **[DNDKit ](https://dndkit.com/)** - Drag and drop library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Redux Toolkit](https://redux-toolkit.js.org/)** - State management

### Styling & UI

- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Motion](https://motion.dev/)** - Animation library

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

## 📧 Contact

**Abdelrahman Mostafa**  
GitHub: [@AbdelrahmanMostafa0](https://github.com/AbdelrahmanMostafa0)

---

<div align="center">
  <p>ساعتين شاي وكوباية جد وكله هيبقى تمام 🍵</p>
</div>

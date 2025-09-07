# Weather Now

A simple and elegant weather application built with React, Vite, and TypeScript that provides real-time weather data for your current location or any place worldwide.

## Features

- **Current Location Weather**: Automatically fetches and displays the weather for your current location on startup.
- **Global Search**: Search for any city or location to get its current weather conditions.
- **Detailed Weather Data**: Displays the current temperature, a weather summary (e.g., "Clear and bright skies"), humidity, and wind speed.
- **Localized Time**: Shows the correct local time for the location being viewed, whether it's your current location or a browsed one.
- **Persistent Selection**: Remembers your last searched location and loads it automatically the next time you open the search page.
- **12/24 Hour Format**: Easily toggle between 12-hour and 24-hour time formats.

## Tech Stack

- **Framework**: [React](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **APIs**:
  - [Open-Meteo](https://open-meteo.com/) for weather data.
  - [Nominatim (OpenStreetMap)](https://nominatim.org/) for forward geocoding (search).
  - [OpenCage](https://opencagedata.com/) for reverse geocoding (getting location name from coordinates).

---

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### 1. API Key Setup

This application uses the **OpenCage Geocoding API** to determine the name of your current location from your browser's coordinates.

1.  Go to [opencagedata.com](https://opencagedata.com/) and sign up for a free account to get an API key.
2.  In the **root directory** of the project, create a new file named `.env.local`.
3.  Open the `.env.local` file and add your API key in the following format:

```env
VITE_OPENCAGE_API_KEY=YOUR_API_KEY_HERE
```

4.  Replace `YOUR_API_KEY_HERE` with your actual key from the OpenCage dashboard.

**Important**: After creating or changing the `.env.local` file, you must **restart your development server** for the new variable to be loaded.


### 2. Installation

Clone the repository (or use your existing project files) and install the necessary dependencies.

```bash
npm install
```

### 3. Running the Development Server

Once the dependencies are installed, you can start the local development server.

```bash
npm run dev
```

The application should now be running on `http://localhost:5173` (or another port if 5173 is busy).

## How to Use

- **Home Screen**: When you first load the app, it will ask for your location to show you the local weather. The clock on this screen is a live, running clock for your current time.
- **Search Screen**: Click the search icon in the bottom navigation to go to the search page.
  - Type a location name (at least 3 characters) to see a list of results.
  - Each result in the list will show its current temperature.
  - Click on a result to see its full weather details.
  - The clock on this view shows the static, local time for the searched place.
  - Click the "Back to Search" button to return to the search input. Your previous search term and results will still be there.
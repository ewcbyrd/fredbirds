# Fredericksburg Regional Bird Club Website

A React-based website for the Fredericksburg Regional Bird Club, featuring event management, sightings tracking, newsletters, and member resources.

## Technology Stack

- **Frontend**: React 18 with React Router
- **UI Library**: Material-UI (MUI) v5
- **Build Tool**: Vite 5
- **Calendar**: react-big-calendar
- **Photo Gallery**: react-photo-album with yet-another-react-lightbox
- **Backend API**: Node.js API hosted on Heroku
- **Database**: MongoDB
- **Deployment**: GitHub Pages with GitHub Actions

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository

```bash
git clone https://github.com/ewcbyrd/birds.git
cd birds
```

2. Install dependencies

```bash
npm ci
```

3. Create a `.env` file (use `.env.example` as template)

```bash
cp .env.example .env
```

4. Add your API keys to `.env`

```
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Development

Start the development server:

```bash
npm run dev
```

Open http://localhost:5173 to view the app in your browser.

### Building for Production

Build the project:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/       # React components
├── services/         # API service layer
│   ├── ebirdService.js
│   └── restdbService.js
├── resources/        # Static assets (images, icons)
└── App.jsx          # Main application component
```

## Features

- **Events**: Calendar view and list of upcoming club events
- **Announcements**: Latest club news and announcements
- **Sightings**: Browse notable bird sightings by state and county
- **Rare Birds**: Track rare bird observations
- **News Feed**: Birding news from various sources
- **Newsletters**: Archive of club newsletters
- **Photo Gallery**: Club photos organized by category
- **Membership**: Online membership form
- **Resources**: Birding resources and links
- **Officers**: Club leadership information
- **FAQs**: Frequently asked questions

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the `main` or `Styling-Improvements` branches.

### Manual Deployment

To deploy manually:

1. Ensure GitHub Pages is enabled in repository settings
2. Add `VITE_GOOGLE_MAPS_API_KEY` to repository secrets
3. Push to the main branch or trigger the workflow manually

## Environment Variables

- `VITE_GOOGLE_MAPS_API_KEY` - Google Maps API key for location features

## API Endpoints

The app connects to `https://fredbirds-api.herokuapp.com/` with the following endpoints:

- `/events` - Event data
- `/announcements` - Club announcements
- `/newsletters` - Newsletter archive
- `/photos` - Photo gallery data
- `/members` - Membership data
- `/newsfeeds` - News feed sources
- `/rarebirds` - Rare bird sightings
- `/locations` - State and county data

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Copyright © 2025 Fredericksburg Regional Bird Club

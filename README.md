# Fredericksburg Regional Bird Club Website

A React-based website for the Fredericksburg Regional Bird Club, featuring event management, sightings tracking, newsletters, member resources, and dynamic photo galleries.

## 🚀 Features

- **Events**: Calendar view and list of upcoming club events
- **Announcements**: Latest club news and announcements  
- **Photo Gallery**: Dynamic photo galleries organized by category (People, Places, Birds)
- **Sightings**: Browse notable bird sightings by state and county
- **News Feed**: Birding news from various sources
- **Newsletters**: Archive of club newsletters
- **Membership**: Online membership form with Auth0 integration
- **Resources**: Birding resources and hotspot information
- **Officers**: Club leadership directory with profile photos
- **Responsive Design**: Mobile-friendly interface with Material-UI components

## 🏗️ Technology Stack

- **Frontend**: React 18 with React Router v6
- **UI Library**: Material-UI (MUI) v5 with Emotion styling
- **Build Tool**: Vite 5
- **Authentication**: Auth0 for member access
- **Image Storage**: Cloudinary CDN with automatic optimization
- **Calendar**: react-big-calendar for event display
- **Photo Gallery**: react-photo-album with yet-another-react-lightbox
- **Backend API**: Node.js API hosted on Heroku  
- **Database**: MongoDB with RestDB interface
- **Deployment**: GitHub Pages with GitHub Actions

## 📸 Image Management System

The application uses a modern, database-driven image management system with Cloudinary CDN for optimal performance and scalability.

### Architecture
- **Storage**: Images hosted on Cloudinary CDN
- **Database**: Image metadata stored in RestDB with `cloudinary_public_id` field
- **Optimization**: Automatic format optimization (`f_auto,q_auto`)
- **Transformations**: Dynamic resizing and cropping via URL parameters
- **Performance**: Global CDN delivery with automatic WebP/AVIF format selection

### Adding New Images

1. **Upload to Cloudinary**
   - Upload image to Cloudinary account (Cloud Name: `doqy8jape`)
   - Note the public ID (e.g., `"new-photo.jpg"`)

2. **Add Database Record** (in RestDB photos collection)
   ```json
   {
     "header": "Photo Title",
     "description": "Photo description", 
     "category": "people|places|birds",
     "cloudinary_public_id": "new-photo.jpg"
   }
   ```

3. **Available Categories**
   - `people` - Club member photos, group shots, meetings
   - `places` - Birding locations, field trip destinations
   - `birds` - Bird species photos and observations

### Image Transformations

The system provides optimized images for different use cases:

```javascript
import { getCloudinaryUrl, transformations } from './services/cloudinaryService'

// Basic optimized image
const imageUrl = getCloudinaryUrl('photo.jpg', transformations.optimized)

// Thumbnail for gallery
const thumbUrl = getCloudinaryUrl('photo.jpg', transformations.thumbnail)

// Hero image for homepage
const heroUrl = getCloudinaryUrl('photo.jpg', transformations.hero)
```

**Available transformations:**
- `optimized`: Auto format and quality (`f_auto,q_auto`)
- `thumbnail`: 300x300px, cropped for gallery previews
- `medium`: 800x600px, fitted for modal views
- `hero`: 1200x800px, cropped for homepage banners

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Cloudinary account (for image management)
- Auth0 account (for authentication)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/ewcbyrd/birds.git
cd birds
```

2. **Install dependencies**

```bash
npm ci
```

3. **Environment Setup**

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

4. **Add your configuration to `.env.local`**

```env
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

5. **Configure Cloudinary**

Update `src/services/cloudinaryService.js` if using a different Cloudinary account:

```javascript
const CLOUD_NAME = 'your-cloudinary-cloud-name'
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

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── Photos.jsx       # Dynamic photo gallery
│   ├── Officers.jsx     # Officer directory  
│   ├── Home.jsx         # Homepage with hero carousel
│   ├── Events.jsx       # Event calendar and list
│   ├── Header.jsx       # Navigation header
│   └── ...              # Other feature components
├── services/            # API services and utilities
│   ├── cloudinaryService.js  # Image management
│   ├── restdbService.js      # Database API
│   ├── ebirdService.js       # eBird integration
│   └── weatherService.js     # Weather data
├── hooks/               # Custom React hooks
│   └── useUserRole.js   # Auth0 user role management
├── index.css           # Global styles
└── main.jsx            # Application entry point
```

## 🔧 Core Components

### Photos Component (`/src/components/Photos.jsx`)
Dynamic photo gallery with category-based filtering.

**Features:**
- Tab-based navigation (People, Places, Birds)
- Lightbox for full-size viewing
- Database-driven content loading
- Responsive grid layout
- Automatic image optimization

### Officers Component (`/src/components/Officers.jsx`)  
Club leadership directory with contact information.

**Features:**
- API-driven officer data
- Cloudinary profile photos
- Fallback to hardcoded data
- Contact information display
- Responsive contact cards

### Home Component (`/src/components/Home.jsx`)
Homepage featuring rotating hero images and announcements.

**Features:**
- Hero image carousel from Cloudinary
- Rotating announcements display
- Integration with Events and NearbySightings
- Call-to-action sections

## 🔌 API Services

### Cloudinary Service (`/src/services/cloudinaryService.js`)
Centralized image management service.

```javascript
// Core functions
export const getCloudinaryUrl = (publicId, transformations = '')
export const getPictureUrl = (pictureValue, transformation = transformations.optimized)

// Predefined transformations
export const transformations = {
  thumbnail: 'w_300,h_300,c_fill',
  medium: 'w_800,h_600,c_fit',
  hero: 'w_1200,h_800,c_fill', 
  optimized: 'f_auto,q_auto'
}
```

### RestDB Service (`/src/services/restdbService.js`)
Database integration for dynamic content.

**Key functions:**
```javascript
export const getPhotos = async ()           // Photo gallery data
export const getOfficers = async ()         // Officer directory
export const getAnnouncements = async ()    // Homepage announcements
export const getEventsByYear = async (year) // Event calendar data
export const getFutureEvents = async ()     // Upcoming events
```

## 🌐 Deployment

The site automatically deploys to GitHub Pages when changes are pushed to the `main` branch.

### Environment Variables

Configure these in your hosting platform:

- `VITE_AUTH0_DOMAIN` - Auth0 domain for authentication
- `VITE_AUTH0_CLIENT_ID` - Auth0 client ID
- `VITE_GOOGLE_MAPS_API_KEY` - Google Maps API key for location features

### Manual Deployment

1. Ensure GitHub Pages is enabled in repository settings
2. Add environment variables to repository secrets
3. Push to main branch or trigger workflow manually

## 🔄 Migration History

### Image Migration (November 2024)
Major migration from local image storage to Cloudinary CDN:

**Before:**
- Images stored locally in `/src/resources/photos/`
- Hardcoded image mappings in components
- Large repository size (~50MB)
- Manual Vite bundling for images

**After:**
- Images hosted on Cloudinary CDN
- Database-driven image management
- Automatic optimization and format selection
- Repository size reduced by ~90%
- Global CDN delivery

**Removed Features:**
- RareBirds component (non-functional)
- Legacy local image system
- Hardcoded image mappings

## 🔗 API Endpoints

The app connects to `https://fredbirds-api.herokuapp.com/` with these endpoints:

- `/events` - Event calendar data
- `/announcements` - Club announcements
- `/newsletters` - Newsletter archive
- `/photos` - Photo gallery metadata
- `/members` - Membership and officer data
- `/newsfeeds` - News feed sources
- `/locations` - State and county data for sightings

## 🤝 Contributing

### Adding New Features

1. **Create feature branch**
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Follow established patterns**
   - Use Material-UI components
   - Implement responsive design
   - Add proper error handling
   - Include loading states

3. **Image handling**
   - Upload images to Cloudinary first
   - Use database-driven approach for dynamic content
   - Apply appropriate transformations
   - Include proper alt text

### Code Style Guidelines

- Use functional components with React hooks
- Follow Material-UI design system
- Implement proper error boundaries
- Use consistent file naming (PascalCase for components)
- Add comments for complex logic

### Testing Workflow

1. Test feature locally
2. Verify responsive design
3. Check image loading and optimization
4. Test authentication flows
5. Submit pull request with description

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 License

Copyright © 2025 Fredericksburg Regional Bird Club. All rights reserved.

---

**Last Updated**: November 2024  
**Version**: 2.0.0 (Post-Cloudinary Migration)  
**Maintainer**: Development Team
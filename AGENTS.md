# AGENTS.md - Fredericksburg Regional Bird Club Website

## Project Overview

React 18 SPA for the Fredericksburg Regional Bird Club (`www.fredbirds.com`).
Built with Vite 5, Material UI v5, Auth0 authentication, and ES Modules.
Pure JavaScript (JSX) -- no TypeScript. Backend is a Node.js API on Heroku with MongoDB/RestDB.

## Tech Stack

- **Framework:** React 18 with React Router v6
- **Build:** Vite 5 (`@vitejs/plugin-react`)
- **UI Library:** MUI v5 (`@mui/material`, `@mui/icons-material`, `@mui/x-date-pickers`)
- **Styling:** MUI `sx` prop + Emotion (`@emotion/react`, `@emotion/styled`)
- **Auth:** Auth0 (`@auth0/auth0-react`)
- **Maps:** Leaflet / React-Leaflet
- **Dates:** date-fns v2
- **Package Manager:** npm (use `npm ci` for installs)
- **Node Version:** 20 (required by CI)

## Build / Dev / Lint Commands

```bash
npm run dev        # Start Vite dev server (http://localhost:5173)
npm run build      # Production build (output: dist/)
npm run preview    # Preview production build locally
```

### Linting and Formatting (no npm scripts defined)

```bash
npx eslint .               # Run ESLint (config in .eslintrc.json)
npx prettier --write .     # Format all files
npx prettier --check .     # Check formatting without writing
```

### Testing

No test framework is currently configured. There are no test files, no test runner,
and no `test` script. If adding tests, use Vitest (natural fit for Vite projects)
with React Testing Library.

### CI/CD

- **PR checks:** `npm ci && npm run build` (build verification only, no lint/test gate)
- **Deploy:** Push to `main` triggers GitHub Pages deploy to `gh-pages` branch
- **Environment:** Build requires `VITE_*` env vars (Auth0, Google Maps, OpenWeather, eBird, Cloudinary)

## Project Structure

```
src/
  App.jsx                  # Root: MUI theme, routing, idle timeout
  main.jsx                 # Entry: Auth0Provider + BrowserRouter
  index.css                # Minimal global styles (35 lines)
  components/
    admin/                 # Admin & officer tools (AdminPanel, OfficerTools, Manage*Dialog)
    auth/                  # Auth & access control (AccessControl, ProtectedRoute, RoleBadge)
    common/                # Reusable shared components (AppCard, PageContainer, AppDialog, etc.)
    events/                # Event feature (Events, EventForm, EventList, EventMap, etc.)
    forms/                 # Form components (AnnouncementForm, MemberForm, *FormModal, PhotoUploadForm)
    layout/                # App shell (Header, UserProfile, ContactTile)
    members/               # Member feature (MemberDashboard, MemberProfile, MembersDirectory, etc.)
    news/                  # News & announcements (News, NewsFeed, Announcements, Newsletters)
    pages/                 # Static/info pages (Home, About, Contact, FAQs, Resources, Officers, Photos, Profile)
    sightings/             # Bird sightings (MySightings, NearbySightings, MapModal)
  hooks/                   # Custom hooks (useUserRole, useIdleTimeout, useScrollAnimation, useMember)
  services/                # API clients (restdbService, ebirdService, cloudinaryService, weatherService)
  utils/                   # Utilities (rareBirdsUtils, dateUtils, memberUtils)
api/                       # Serverless API routes
docs/                      # Project documentation guides
scripts/                   # Node.js utility scripts
public/                    # Static assets
```

## Code Style Guidelines

### Formatting (Prettier)

- **Single quotes** -- always use `'`, never `"`
- **4-space indentation** (tabWidth: 4)
- **No trailing commas** (trailingComma: "none")
- **No semicolons** -- the codebase omits semicolons (enforced by convention)

### Imports

Order imports in this sequence:

1. `react` and React hooks
2. Third-party libraries (`react-router-dom`, `@auth0/auth0-react`, `date-fns`)
3. Custom hooks (`from '../hooks/...'`)
4. MUI theme/styles (`from '@mui/material/styles'`)
5. MUI components (individual imports preferred: `import Box from '@mui/material/Box'`)
6. MUI icons (`from '@mui/icons-material/...'`)
7. Local components (`from './...'` or `from '../components/...'`)
8. Services (`from '../services/...'`)
9. CSS imports last (`import './index.css'`)

All imports use relative paths. No path aliases are configured.

### Component Patterns

- **Functional components only** -- no class components
- Two declaration styles coexist:
    - Page/route components: `export default function ComponentName({ props }) { ... }`
    - Reusable/common components: `const ComponentName = ({ props }) => { ... }` with `export default ComponentName`
- **Default exports** for all components
- **Named exports** for service functions, constants, and hooks
- Services also export a default object containing all named exports
- Hooks export both named and default (`export const useX = ...; export default useX`)

### Naming Conventions

| Entity              | Convention                         | Example                                     |
| ------------------- | ---------------------------------- | ------------------------------------------- |
| Component files     | PascalCase.jsx                     | `EventForm.jsx`, `MemberDashboard.jsx`      |
| Hook files          | camelCase.js with `use` prefix     | `useUserRole.js`                            |
| Service files       | camelCase.js with `Service` suffix | `restdbService.js`                          |
| Utility files       | camelCase.js with `Utils` suffix   | `rareBirdsUtils.js`                         |
| Script files        | kebab-case.js                      | `setup-access-levels.js`                    |
| Components          | PascalCase                         | `const AppCard = ...`                       |
| Functions/variables | camelCase                          | `handleSubmit`, `yearEvents`                |
| Event handlers      | `handle` prefix                    | `handleChange`, `handleSelectEvent`         |
| Constants           | SCREAMING_SNAKE_CASE               | `ACCESS_LEVELS`, `WEATHER_API_KEY`          |
| Booleans            | `is`/`show`/`has`/`loading` prefix | `isAuthenticated`, `showMessage`, `loading` |

### Styling

- **Use MUI `sx` prop** for all component styling -- this is the sole styling approach
- Use MUI responsive shorthand for breakpoints: `px: { xs: 3, md: 6 }`
- Use `useTheme()` and `useMediaQuery()` for dynamic theme/responsive logic
- MUI theme is defined in `App.jsx` with custom palette (forest green primary, golden amber secondary)
- Global CSS (`index.css`) is minimal -- do not add significant styles there
- No CSS modules, no Tailwind, no styled-components

### Error Handling

- Use `try/catch` with `useState` for error display in components:
    ```jsx
    const [error, setError] = useState(null);
    try {
        await someOperation();
    } catch (err) {
        console.error('Error doing X:', err);
        setError(err.message || 'Fallback error message');
    }
    ```
- Display errors with MUI `<Alert severity="error">` with `onClose` to dismiss
- Services throw on HTTP errors: `throw new Error(\`HTTP \${res.status}: \${res.statusText}\`)`
- Some services return graceful degradation objects (`{ items: [], error: error.message }`)
- Use `console.error` for error logging (no structured logging library)
- No React error boundaries exist currently

### State Management

- **No external state library** -- all state is `useState`/`useEffect`
- Auth state via `useAuth0()` hook
- Role-based access via `useUserRole()` custom hook
- Data fetching happens directly in `useEffect` or event handlers (no React Query/SWR)
- `sessionStorage` used for caching (e.g., rare birds data)
- Props drilling via `onNavigate` pattern from App through child components

### Access Control

Four-tier role hierarchy defined in `src/hooks/useUserRole.js`:

- `ACCESS_LEVELS.PUBLIC` -- no auth required
- `ACCESS_LEVELS.MEMBER` -- authenticated member
- `ACCESS_LEVELS.OFFICER` -- club officer
- `ACCESS_LEVELS.ADMIN` -- administrator

Routes are protected using `<MemberAccessControl requiredLevel={ACCESS_LEVELS.X}>` or
`<ProtectedRoute>` wrapper components in `App.jsx`.

### Comments

- Use JSDoc (`/** ... */`) for hooks and utility functions with `@param` and `@returns`
- Use inline `//` comments for clarification
- Use `{/* ... */}` block comments in JSX to label sections
- Extensive `console.log` debug statements exist in auth/role code (this is intentional)

### Environment Variables

All client-side env vars use the `VITE_` prefix (required by Vite):

- `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`
- `VITE_GOOGLE_MAPS_API_KEY`
- `VITE_OPENWEATHER_API_KEY`
- `VITE_EBIRD_KEY`
- `VITE_CLOUDINARY_UPLOAD_PRESET`, `VITE_CLOUDINARY_CLOUD_NAME`

Access via `import.meta.env.VITE_*`. Never commit `.env` or `.env.local` files.

### Important Conventions

- ES Modules only (`"type": "module"`) -- no CommonJS `require()`
- Use `inclusive-language/use-inclusive-words` ESLint rule (enforced as error)
- Backend API base URL: `https://fredbirds-api.herokuapp.com/`
- All API calls go through service files in `src/services/` -- do not call APIs directly from components
- The `dist/` directory is the build output -- never commit it

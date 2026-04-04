---
name: api-integration
description: Backend API patterns, service file conventions, and error handling for the fredbirds project
---

## API Integration Rules

### Service Architecture
- **ALL API calls MUST go through service files** in `src/services/`
- **NEVER call APIs directly from components** -- always import from a service
- Four service files exist:
  - `restdbService.js` -- Main backend API (Heroku/MongoDB)
  - `ebirdService.js` -- eBird API integration
  - `cloudinaryService.js` -- Image upload/management
  - `weatherService.js` -- OpenWeather API

### Backend API Base URL
```
https://fredbirds-api.herokuapp.com/
```

### Service File Conventions
- Named exports for each function: `export const getEvents = async () => { ... }`
- Also export a default object containing all named exports
- Internal helper functions (`get`, `post`, `patch`, `del`) are private to the service
- Services throw on HTTP errors: `throw new Error(\`HTTP \${res.status}: \${res.statusText}\`)`

### Error Handling Pattern in Components
Always use this pattern when calling services from components:

```jsx
const [error, setError] = useState(null)
const [loading, setLoading] = useState(false)

const fetchData = async () => {
    setLoading(true)
    try {
        const data = await someServiceFunction()
        // update state with data
    } catch (err) {
        console.error('Error doing X:', err)
        setError(err.message || 'Fallback error message')
    } finally {
        setLoading(false)
    }
}
```

### Displaying Errors
Use MUI Alert component with dismiss capability:

```jsx
import Alert from '@mui/material/Alert'

{error && (
    <Alert severity="error" onClose={() => setError(null)}>
        {error}
    </Alert>
)}
```

### Data Fetching
- Fetch data in `useEffect` or event handlers -- no React Query or SWR
- Use `sessionStorage` for caching where appropriate (e.g., rare birds data)
- Loading states use `useState` booleans (`loading`, `isLoading`)

### Environment Variables
All client-side API keys use the `VITE_` prefix and are accessed via `import.meta.env.VITE_*`:
- `VITE_EBIRD_KEY` -- eBird API
- `VITE_OPENWEATHER_API_KEY` -- OpenWeather
- `VITE_GOOGLE_MAPS_API_KEY` -- Google Maps
- `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET` -- Cloudinary
- `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID` -- Auth0

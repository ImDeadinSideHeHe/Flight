# Flight Log Management System

Flight Log Management System is a React web application for managing flight log records and user accounts. It supports Supabase authentication, flight log CRUD, user management, profile editing, and light/dark theme switching.

Cloud demo: https://flight-puce.vercel.app/

## Features

- Login with username and password using Supabase Auth
- View all flight log entries
- Create, update, and delete flight logs
- Search flight logs by Flight ID
- Automatically calculate flight duration from takeoff and landing time
- Manually edit duration when needed
- Create, edit, soft-delete, and change password for users
- Edit the signed-in user's profile
- Light and dark theme support

## Tech Stack

- Frontend: React 19, Vite 7, React Router, Tailwind CSS 4, Tailux UI components
- Tables: TanStack React Table
- UI libraries: Headless UI, Heroicons, React Icons, Sonner toast notifications
- Backend: Supabase
- Database: Supabase Postgres
- Authentication: Supabase Auth
- Font: Inter from Google Fonts
- Deployment: Vercel

## Backend Data

The app uses Supabase for both authentication and database storage.

Main database tables:

- `FlightDetails`
  - `id`
  - `TailNumber`
  - `FlightID`
  - `TakeOff_Time`
  - `Landing_Time`
  - `Duration`
- `User`
  - `id`
  - `Username`
  - `Email`
  - `Phone`
  - `IsDeleted`
  - `created_at`
  - `modified_at`

Deleted users are soft-deleted by setting `IsDeleted` to `true`, then hidden from the user management table.

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-publishable-key
```

Use the Supabase publishable key for `VITE_SUPABASE_ANON_KEY`. Do not put the secret key in the frontend.

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Lint

Run ESLint:

```bash
npm run lint
```

## Notes

- Node.js 20 or newer is recommended for Vite 7.
- The app expects Supabase Auth users to exist before login.
- Usernames are converted into login emails by the app, so users can sign in with their username and password.

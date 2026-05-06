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
  - `IsDeleted`
  - `created_at`
  - `created_by`
  - `modified_at`
  - `modified_by`
- `User`
  - `id`
  - `Username`
  - `Email`
  - `Phone`
  - `IsDeleted`
  - `created_at`
  - `created_by`
  - `modified_at`
  - `modified_by`


## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

## Build

Create a production build:

```bash
npm run build
```




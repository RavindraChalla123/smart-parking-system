# SmartPark Commercial Frontend + Authentication

## Requirements
- Node.js 18+
- Spring Boot backend running on http://localhost:8080

## Frontend
```bash
npm install
npm run dev
```
Open http://localhost:5173

The Vite development proxy forwards `/api/*` to the Spring Boot backend, so local development does not require browser CORS configuration.

## Authentication
The matching backend adds:
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/logout`

Registration creates a normal `USER` account and hashes the password with BCrypt. Login uses an HTTP session. The frontend restores the logged-in account after refresh.

## User flow
1. Open `/register` and create an account.
2. You are signed in automatically.
3. Find a parking spot and make a booking.
4. `/bookings` shows only the signed-in user's bookings.
5. `/profile` shows the signed-in user's account.
6. Sign out from the header or profile page.

## Important
Use the matching backend ZIP supplied with this frontend. The old backend does not contain the `/auth/*` endpoints.

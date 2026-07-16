# Synova Frontend

Enterprise multi-agent service platform UI for the Synova capstone.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- shadcn-style UI primitives
- Framer Motion
- Lucide icons
- React Router

## Setup

```bash
cd frontend
npm install
npm run dev
```

The app runs on [http://localhost:3000](http://localhost:3000) to match backend CORS.

## Environment

Copy `.env.example` to `.env`:

```env
VITE_CUSTOMER_API_URL=http://127.0.0.1:8000
VITE_EMPLOYEE_API_URL=http://127.0.0.1:8004
```

Endpoints called (unchanged):

- `POST {VITE_CUSTOMER_API_URL}/reception`
- `POST {VITE_EMPLOYEE_API_URL}/reception`

## Demo login

Customer:

- Email: `customer@synova.ai`
- Password: `customer123`

Employee:

- Employee ID: `EMP001`
- Password: `employee123`

Authentication is frontend-only and does not call the backend.

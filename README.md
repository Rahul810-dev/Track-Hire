# TrackHire

**A full-stack job application tracker** that helps you organise your job hunt in one place, with per-user accounts, status tracking and AI-powered insights.

**Live demo:** ADD-YOUR-VERCEL-LINK-HERE

## Features

- **Secure authentication** with JWT, register and login
- **Multi-user data isolation**: every user only sees their own applications
- **Full CRUD** for job applications (add, view, edit, delete)
- **AI insights** powered by Gemini 2.5 Flash, summarising your job search
- **Visual dashboard** with Recharts charts of application status
- **Dark mode** and a settings page

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS, Recharts |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Auth | JWT |
| AI | Google Gemini 2.5 Flash |
| Deployment | Vercel (frontend), Render (backend) |

## Project Structure

```
TRACKHIRE/
├── trackhire-backend/     # Express REST API
│   ├── routes/            # API route handlers
│   ├── db.js              # PostgreSQL connection
│   └── server.js          # App entry point
└── trackhire-frontend/    # React + Vite app
    └── src/
        ├── api/           # Axios setup
        ├── components/    # Reusable UI components
        ├── context/       # Theme and auth context
        ├── pages/         # App pages
        └── utils/         # Helper functions
```

## Run Locally

**Prerequisites:** Node.js, PostgreSQL, a Gemini API key

```bash
git clone https://github.com/Rahul810-dev/Track-Hire.git
cd Track-Hire
```

**Backend**

```bash
cd trackhire-backend
npm install
```

Create a `.env` file in `trackhire-backend`:

```env
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

```bash
node server.js
```

**Frontend**

```bash
cd trackhire-frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## What I Learned

- Designing a REST API with JWT auth and keeping each user's data isolated in PostgreSQL
- Integrating an LLM API into a real feature
- Deploying a split frontend and backend across Vercel and Render

## Author

**Rahul N**, final-year CSE student
[LinkedIn](https://linkedin.com/in/rahul-n-a0b5b9314) | [Portfolio](https://rahul810-dev.github.io/MyPortfolio)

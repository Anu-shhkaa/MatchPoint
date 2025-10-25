MatchPoint - Live College Sports Platform

MatchPoint is a full-stack, real-time web application designed to manage and broadcast live scores for college sports events. It provides a seamless experience for both students (viewers) and the college Sports Council (admins).

This project was built as a full-stack development mini-project, incorporating a RESTful API, real-time WebSocket communication, and a responsive React frontend.

Features

Viewer Features

Live Score Dashboard: A homepage showing all currently live matches in real-time.

Event Pages: Dedicated pages for each event (e.g., "VCL," "Indoor Sphurti").

Live Points Table: Points tables that update instantly as matches are finalized.

Schedules & Results: Clear tabs for upcoming schedules and past match results.

Light/Dark Mode: A toggleable theme for user comfort.

Admin Features

Secure Admin Panel: Protected routes accessible only via a secret code and JWT authentication.

Flexible Event Creation: Admins can create new events (like "VCL" or "Sphurti"), link sports, teams, and a custom-built pointing system.

Master Data Management: A settings page to create and manage all Sports, Teams (both Department and Franchise), and Pointing Systems.

Live Match Control: A mobile-friendly interface to update match scores (which are broadcast in real-time via WebSockets) and finalize results.

Automatic Points Calculation: When a match is finalized, the backend automatically calculates the points based on the event's pointing system and updates the live points table.

Complex Joker Logic: A "post-event" module where admins can upload an Excel file of Joker submissions. The backend runs a complex calculation to compare achievements and apply bonus points, finalizing the event winner.

Tech Stack

This project is a full-stack monorepo with a separate backend and frontend.

Backend (/backend)

Node.js & Express.js: For the RESTful API server.

MongoDB & Mongoose: As the NoSQL database for flexible data modeling.

Socket.IO: For real-time, bi-directional communication (live scores, points table updates).

JSON Web Tokens (JWT): For securing the admin API routes.

xlsx & multer: For parsing the admin's uploaded Excel file for Joker logic.

Frontend (/frontend)

React 18 & Vite: A fast, modern React setup with hooks.

React Router: For all client-side page navigation.

React Context: For global state management (Auth, Theme, Sockets).

Tailwind CSS: For the responsive, mobile-first, and themeable UI.

Axios: For all API communication, with an interceptor to auto-inject the JWT.

socket.io-client: To receive real-time events from the server.

How to Run

1. Backend Setup

Navigate to the backend folder: cd backend

Install dependencies: npm install

Create a .env file and add your MONGO_URI, JWT_SECRET, and ADMIN_SECRET_CODE.

Start the backend server: node server.js
(Server will run on http://localhost:3001)

2. Frontend Setup

Open a new terminal and navigate to the project's root folder (where vite.config.js is).

Install dependencies: npm install

Start the frontend server: npm run dev
(Server will run on http://localhost:5173)

Open http://localhost:5173 in your browser.

This project fulfills all mini-project requirements, including a responsive UI, React with Hooks/Context, a RESTful API with authentication, real-time WebSocket updates, and a CI/CD-ready deployment structure.
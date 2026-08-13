# Echo - Frontend

This is the frontend repository for **Echo**, a full-stack blog platform. It provides a modern, responsive interface for user authentication, post creation and management, likes, comments, and interaction with the Echo REST API.

🔗 **Backend Repository:** [Echo Backend](https://github.com/rishitsharma07/echo-backend)

🌐 **Live Application:** https://echo-frontend-gilt-gamma.vercel.app

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router DOM
- **Styling:** Vanilla CSS (CSS Variables, Flexbox/Grid)
- **HTTP Client:** Axios
- **Deployment:** Vercel

## Features

- **User Authentication:** Registration and login with JWT-based authentication.
- **Post Feed:** Browse posts with author, date, like, and comment information.
- **Post Details:** View individual posts and their associated interactions.
- **Create Posts:** Authenticated users can create new blog posts.
- **Edit Posts:** Users can edit their own posts.
- **Delete Posts:** Users can delete their own posts.
- **Likes:** Like and unlike posts.
- **Comments:** Add and interact with comments on posts.
- **Protected Routes:** Authentication-aware navigation and API requests.
- **Responsive Design:** Optimized for desktop and mobile screens.
- **Modern UI:** Light Neo-Minimalist design with Rose & Amber accents, smooth animations, and glass-style components.

## Project Structure

```text
echo-frontend/
├── public/
├── src/
│   ├── api/
│   │   └── axios.js
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have:

- Node.js installed
- npm installed
- The Echo backend running locally

### Clone the Repository

```bash
git clone https://github.com/rishitsharma07/echo-frontend.git
cd echo-frontend
```

### Install Dependencies

```bash
npm install
```

## Environment Variables

The frontend uses Vite environment variables to configure the backend API URL.

### Local Development

Create a `.env.local` file in the project root:

```text
VITE_API_URL=http://localhost:8080
```

The frontend uses this value when making API requests:

```text
http://localhost:8080/api/v1
```

`.env.local` is ignored by Git and should not be committed.

### Production

The production API URL is configured through Vercel Environment Variables:

```text
VITE_API_URL=https://echo-backend-hv2v.onrender.com
```

No production `.env` file needs to be committed to the repository.

## Running Locally

### 1. Start the Backend

Make sure the Echo Spring Boot backend is running on:

```text
http://localhost:8080
```

See the [Echo Backend](https://github.com/rishitsharma07/echo-backend) repository for backend setup instructions.

### 2. Start the Frontend

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

## Building for Production

Create a production build:

```bash
npm run build
```

The generated production files are placed in:

```text
dist/
```

To preview the production build locally:

```bash
npm run preview
```

## API Integration

The frontend communicates with the Echo Spring Boot REST API using Axios.

The API base URL is configured through:

```text
VITE_API_URL
```

Authentication tokens are stored in the browser and automatically attached to authenticated API requests using the Axios request interceptor:

```text
Authorization: Bearer <JWT>
```

The frontend also handles expired or unauthorized sessions by clearing the stored authentication data and redirecting the user when appropriate.

## Deployment

The frontend is deployed on **Vercel**.

### Production Architecture

```text
┌──────────────────────────────┐
│           Vercel             │
│       React + Vite           │
│                              │
│ echo-frontend-gilt-gamma     │
│       .vercel.app            │
└──────────────┬───────────────┘
               │
               │ REST API
               ▼
┌──────────────────────────────┐
│           Render             │
│       Spring Boot API        │
│                              │
│ echo-backend-hv2v            │
│       .onrender.com           │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       Render PostgreSQL      │
└──────────────────────────────┘
```

### Live Links

🌐 **Frontend:** https://echo-frontend-gilt-gamma.vercel.app

🔗 **Backend:** https://echo-backend-hv2v.onrender.com

## Backend Repository

The backend source code and API documentation are available here:

🔗 [Echo Backend](https://github.com/rishitsharma07/echo-backend)

## License

This project is intended for educational and portfolio purposes.

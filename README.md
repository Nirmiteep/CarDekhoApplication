## CarDekho React App

Vite + React SPA that lists cars, allows authenticated users to add new inventory, and provides minimal login/register flows for demos.

### Prerequisites
- Node.js 18+
- npm 10+

### Install dependencies
```bash
npm install
```

### Run the mock API server
The frontend talks to `http://localhost:8080`. Start the lightweight Express server (located in `server/index.js`) in a dedicated terminal:
```bash
npm run server
```

The server persists state in `server/db.json`. It ships with a demo user:
- Email: `demo@cardekho.com`
- Password: `Password@123`

### Start the React dev server
In a second terminal:
```bash
npm run dev
```

Visit the dev server URL that Vite prints (typically `http://localhost:5173`).

### Available npm scripts
- `npm run server` – start the Express mock API
- `npm run dev` – Vite development server
- `npm run build` – production build
- `npm run preview` – preview production build
- `npm run lint` – run ESLint

### API endpoints
- `GET /cars`
- `POST /cars` – requires `Authorization: Bearer <token>` header
- `POST /register`
- `POST /login`

Feel free to edit `server/db.json` to seed additional data.

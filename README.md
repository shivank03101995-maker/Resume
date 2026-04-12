# Editable React Portfolio

This project gives you a portfolio with:

- A React frontend
- A Node/Express backend
- A single editable content file for portfolio data
- Responsive styling with clear spacing and visibility

## Install dependencies

```bash
cd frontend && npm install
cd ../backend && npm install
```

## Run the project

Frontend:

```bash
cd frontend
npm run dev
```

Backend:

```bash
cd backend
npm run dev
```

Frontend:

- `http://localhost:5173`

Backend:

- `http://localhost:4000/api/portfolio`

## Production-style run

```bash
cd frontend
npm run build

cd ../backend
npm start
```

Then open:

- `http://localhost:4000`

Do not open `dist/index.html` directly in the browser for this project, because the portfolio depends on the backend API.

## Main files to edit

- `backend/data/portfolio.json`
- `src/App.jsx`
- `src/styles.css`

## How to customize quickly

Edit `backend/data/portfolio.json` to change:

- Hero section
- About text
- Skills
- Experience
- Projects
- Contact links

Edit `src/styles.css` to change:

- Colors
- Spacing
- Card design
- Typography sizing
- Responsive layout

Edit `src/App.jsx` if you want to:

- Add new sections
- Rearrange the layout
- Add forms or admin features
- Connect a database later

## Development notes

This structure is intentionally simple so you can grow it into a larger full-stack portfolio later. Good next upgrades:

- Add a contact form with backend submission
- Add an admin editor for portfolio content
- Store data in MongoDB or PostgreSQL
- Add authentication for editing
- Deploy frontend and backend separately

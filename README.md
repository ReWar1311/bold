# Bluestone Web App

Modern Vite + React implementation of the Bluestone Bold digital gold experience. It recreates the provided mobile screens (login, OTP verification, buy flow, purchase success) and consumes the mock REST APIs described in `documentation/README.md`, falling back to friendly mock responses whenever the backend is offline.

## Live Demo

- Hosted build: **https://bold-pi.vercel.app**

## Tech Stack

- Vite 7 + React 19 (SPA)
- React Router 7 for routing and auth/buy flow layouts
- Vanilla CSS for the custom visual system inspired by the Figma/PDF references

## Project Structure

```
bluestone-web-app/
├── documentation/           # Assignment brief, PDF, API details
├── public/
│   ├── blue_logo.png        # Brand assets referenced by the UI
│   ├── buy_gold_icon.png
│   ├── flag-india.png       # Flag used in the phone input
│   └── vite.svg
├── src/
│   ├── api.js               # Helper around fetch with graceful mock fallbacks
│   ├── App.jsx              # Router shell that hides nav on auth/buy routes
│   ├── App.css              # Global + screen-specific styles
│   ├── main.jsx             # Vite bootstrap
│   ├── components/
│   │   └── Navbar.jsx
│   └── pages/
│       ├── Home.jsx         # Current rate + CTA
│       ├── LoginOTP.jsx     # Phone capture, consent checkbox, OTP request
│       ├── VerifyOTP.jsx    # 6-digit OTP entry + resend
│       ├── BuySell.jsx      # Amount/weight tabs, summary card, buy button
│       └── BuySuccess.jsx   # Purchase confirmation screen
├── package.json             # Scripts and dependencies
└── vite.config.js
```

## Running Locally

Requirements: Node.js 18+ and npm.

```bash
# install dependencies
npm install

# start the dev server (default: http://localhost:5173)
npm run dev

# optional: type-check/lint
npm run lint

# production build preview
npm run build
npm run preview
```

The frontend expects the mock backend at `http://localhost:5000` (see `documentation/README.md`). If that server is not running, the helper in `src/api.js` returns mock success responses so the UI remains demoable.

## Notes

- The `/login` flow redirects to `/buy` after a successful OTP verification.
- `/buy` uses `getGoldPrice` to hydrate the current INR per gram price, including graceful fallback values.
- Build artifacts are deployed to Vercel at `bold-rewar.vercel.app` via static hosting.

Feel free to extend the pages, add state management, or hook the API helper to a real backend.

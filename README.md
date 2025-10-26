# Tickify - Ticket Management App (Vue Version)

A robust ticket management web app built for HNG-13 Stage 2 using Vue 3. Features landing page, auth (login/signup with validation/toasts), dashboard (stats/logout), and CRUD tickets (real-time val, localStorage persistence). Identical UI across frameworks (wave hero, circles, 1440px max, responsive).

## Frameworks & Libraries Used
- **Vue.js 3**: Core framework (Composition API).
- **vue-router**: SPA routing with protected guards.
- **vue-toastification**: Inline/toast notifications.
- **lucide-vue-next**: Icons (Menu, X, Eye, etc.).
- **Vanilla CSS**: Responsive (Flex/Grid, media queries), semantic HTML, accessibility (ARIA, focus).
- **Vite**: Build tool for fast dev/prod.

## Setup & Run Locally
1. Clone repo: `git clone https://github.com/MKNas01/tickify-vue && cd tickify-vue`.
2. Install deps: `npm install`.
3. Run dev server: `npm run dev` (localhost:5173).
4. Build for prod: `npm run build` (serve `/dist` with `npx serve dist`).

## Switching Versions
- **React**: [GitHub](https://github.com/MKNas01/tickify-react) | [Netlify Live](https://tickify-react.netlify.app/tickets).
- **Vue**: [GitHub](https://github.com/MKNas01/tickify-vue) | [Netlify Live](https://tickify-vue.netlify.app/).
- **Twig**: [GitHub](https://github.com/MKNas01/tickify-twig) | [Render Live](https://tickify-twig.onrender.com/auth/login).

## UI Components & State Structure
- **Landing**: Static hero (wave SVG, circles, CTAs), features cards, footer.
- **Auth (Login/Signup)**: Forms with reactive refs, real-time val (computed errors), password toggle, toasts on submit.
- **Dashboard**: Stats cards (computed from tickets ref), sidebar nav (props/emits), logout clears localStorage.
- **Tickets**: Form (reactive form, val on input/blur), list (v-for cards with status classes), CRUD (localStorage save/load, confirm delete).
- **State**: reactive refs for form/errors/tickets, onMounted for guards/load, computed for stats/hasErrors.

## Accessibility & Notes
- Semantic HTML (`<main>`, `<section>`, `<label for>`, ARIA-describedby for errors).
- Focus visible (`:focus { outline: 2px solid #60A5FA; }`), keyboard nav (buttons/links).
- Responsive: Mobile stack/column, desktop row/grid (900px+ breakpoint).
- Notes: localStorage sim (no real API); test in incognito for fresh session. No known issues—Lighthouse accessibility 95%+.

## Test User Credentials
- Signup any email (e.g., test@example.com), password >=6 chars.
- Login with created creds.
- Create tickets: Title required, status dropdown, desc optional (>=10 chars if filled).

Built for HNG-13 Frontend Track. Questions? Contact nasirumuhammedkabirux@gmail.com .
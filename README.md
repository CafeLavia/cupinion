# Customer Feedback App Boilerplate

This project is a boilerplate for a customer feedback app using Vite, React, TypeScript, and Tailwind CSS.

## Features
- Vite for fast development
- React + TypeScript
- Tailwind CSS for styling
- React Router DOM placeholder setup
- Production-friendly folder structure

## Folder Structure
```
public/
  favicon.svg
src/
  assets/
  components/
  context/
  hooks/
  layouts/
  pages/
  routes/
  services/
    supabaseClient.ts
  styles/
    global.css
  utils/
  main.tsx
.env.example
```

## Setup
1. Install dependencies:
   ```powershell
   npm install
   ```
2. Start the dev server:
   ```powershell
   npm run dev
   ```

## Environment Variables
Copy `.env.example` to `.env` and fill in your Supabase credentials:
```
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-key
```

---
This project is only boilerplate. No UI components or pages are present yet.

# Cali Creams SPA

Responsive single-page website for Cali Creams with a contact form that sends emails.

## Features

- Mobile-friendly single-page layout
- Hero, flavors, about, and contact sections
- Animated reveal effects and smooth scrolling
- Contact form submission to email using Node.js + Nodemailer
- Netlify Function support for production deployments

## Setup

1. Install dependencies:

   npm install

2. Create `.env` from `.env.example` and update values:

   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_SECURE`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `FROM_EMAIL`
   - `TO_EMAIL`

3. Start the server:

   npm start

4. Open:

   http://localhost:3000

## Netlify Deployment

1. Push this project to GitHub.
2. In Netlify, create a new site from Git and select this repo.
3. Build settings are read from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
4. In Netlify site settings, add environment variables:
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_SECURE`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `FROM_EMAIL`
   - `TO_EMAIL`
5. Redeploy the site.

## Notes

- For Gmail, use an App Password (2FA enabled), not your regular password.
- The form POST endpoint is `/api/contact` and is redirected to Netlify Function `contact` in production.

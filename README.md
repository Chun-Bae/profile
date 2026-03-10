# Personal Bio Website

A clean, minimalist personal profile website built with Next.js 15 (App Router) and Tailwind CSS. It dynamically fetches profile data from a JSON file and includes a simple password protection feature.

## Features
- **Minimalist Design**: A clean, document-like aesthetic that mimics GitHub markdown.
- **Dynamic Data**: Profile data (intro, tech stack, portfolio, certifications) is driven by a `profile.json` file.
- **Password Protection**: Built-in Next.js middleware (`proxy.ts`) ensures the profile is private until unlocked.

## Setup & Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   # The public URL of your profile.json stored in an OCI bucket (Optional)
   # If not provided, it falls back to public/profile.json
   OCI_DATA_URL=https://.../profile.json

   # The password required to view the site (Default: 1234)
   SITE_PASSWORD=your_secure_password
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Data Structure
To update your profile information, edit the `public/profile.json` file (or the file hosted at your `OCI_DATA_URL`). It follows the structure defined in `types/profile.ts`.

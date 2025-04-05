# Wikichu

A simple game designed to ease the onboarding experience for wiki editors.

---

## Table of Contents

- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Contributing](#contributing)

---

## Overview

Wikichu is a small game built to help new wiki editors learn the basics of editing and content management. The project is created with Next.js and uses a few other libraries to support authentication, environment configuration, AI features, and data storage.

---

## Technologies Used

- **Next.js** – React framework for building the app.
- **React** – For creating the user interface.
- **TypeScript** – Adds type checking.
- **Tailwind CSS** – For styling the application.
- **Clerk for Next.js** – Manages user authentication.
- **OpenAI** – Provides AI features.
- **SQLite3** – Local database for data storage.

---

## Project Structure

- **`app/`**  
  Contains the Next.js application files and routes. The main entry is in `app/page.tsx`.

- **`lib/`**  
  Contains utility functions and shared logic.

- **`public/`**  
  Contains static files like images and fonts.

- **Configuration Files:**
  - `.env.example`: Template for environment variables.
  - `.gitignore`: Files to ignore in version control.
  - `next.config.ts`: Configuration for Next.js.
  - `tsconfig.json`: TypeScript configuration.
  - `eslint.config.mjs` and `postcss.config.mjs`: Configurations for ESLint and PostCSS/Tailwind.
  - `package.json`: Lists project dependencies and scripts.

---

## Getting Started

1. **Clone the Repository:**

```bash
git clone https://github.com/BeanieMen/Wikichu.git
cd Wikichu
```

2. **Install Dependencies**
Use one of the following commands:
```bash 
npm install
# or
yarn install
# or
pnpm install
```

3. **Configure Environment Variables:**
Copy the sample file and set the required values:
```sh
cp .env.example .env
```

4. **Run the Development Server:**
Start the application locally:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or using Bun
bun dev
```

5. **Open the Application:**
Visit http://localhost:3000 in your browser.

---

## Contributing
Contributions are welcome. To contribute:

1. **Fork the repository.**

2. **Create a new branch:**
```bash
git checkout -b feature/your-feature-name
```

3. **Make your changes and commit them**.

4. **Push your branch:**
```bash
git push origin feature/your-feature-name
```

5. **Open a pull request with your changes.**
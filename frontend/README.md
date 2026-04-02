# 🌸 Japanese Learning Application - Frontend

This is the frontend component of the Japanese Learning Web Application, built with **React 19**, **Vite**, and **Tailwind CSS**. 
For full project documentation, including backend setup and feature overview, please refer to the [Root README](../README.md).

## 🚀 Built With
- **[React](https://react.dev/)**: For building dynamic user interfaces.
- **[Vite](https://vitejs.dev/)**: For an extremely fast development environment and optimized builds.
- **[Tailwind CSS v4](https://tailwindcss.com/)**: For rapid, utility-first UI styling.
- **[React Router](https://reactrouter.com/)**: For client-side routing.
- **[React OAuth Google](https://react-oauth.vercel.app/) & [Facebook Login](https://github.com/keppelen/react-facebook-login)**: For secure social authentication.

## 🛠️ Quick Start

### 1. Installation
Install all dependencies using npm:
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the `frontend/` directory and define your development variables:
```env
# URL to your backend API
VITE_API_URL=http://localhost:5000/api

# Authentication Client IDs
VITE_GOOGLE_CLIENT_ID=your_google_id_here
VITE_FACEBOOK_APP_ID=your_facebook_id_here
```

### 3. Start Development Server
```bash
npm run dev
```
The client will start at `http://localhost:5173`.

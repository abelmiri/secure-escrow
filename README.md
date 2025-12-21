# امان یار (Aman Yar) - Secure Transaction Platform

امان یار یک پلتفرم امن معاملات و اسکرو ساخته شده با Next.js 15 (App Router)، TypeScript و Material UI. این برنامه محیطی قابل اعتماد برای معاملات دیجیتال امن فراهم می‌کند.

Aman Yar is a secure transaction and escrow platform built with Next.js 15 (App Router), TypeScript, and Material UI. This application provides a trusted environment for safe digital transactions.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Framework**: [Material UI (MUI) v6](https://mui.com/)
- **Styling**: SCSS Modules + MUI Theming
- **Notifications**: [Notistack](https://notistack.com/)
- **Package Manager**: [Bun](https://bun.sh/) (preferred) or Yarn

## Features

- **Modern Architecture**: Built on Next.js App Router for optimal performance and SEO.
- **Authentication System**: Complete auth flow with Context API, JWT handling, and OAuth support.
- **Centralized API Layer**: Robust request handler with interceptors, auto-token refresh, and error handling.
- **Global Toast Notifications**: Integrated `notistack` system for consistent user feedback (Success/Error/Info).
- **Component-Driven UI**: Modular component structure using Material Design principles.
- **Responsive Design**: Fully responsive layouts adapted for RTL (Right-to-Left) support.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0+) or Node.js (v18+)

### Installation

```bash
# Install dependencies using Bun (Recommended)
bun install

# Or using Yarn
yarn install
```

### Running Development Server

```bash
bun dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                 # Next.js App Router pages and layouts
│   ├── layout.tsx       # Root layout with Providers (Theme, Auth, Toasts)
│   └── page.tsx         # Landing page
├── components/          # Reusable UI components
│   ├── Footer/          # Footer component
│   ├── Header/          # Header component
│   └── Landing/         # Landing page specific components
├── context/             # React Context providers (Auth, etc.)
├── lib/                 # Utility functions and shared logic
│   ├── toastManager.ts  # Global toast utility
│   └── validation.ts    # Form validation helpers
├── request/             # API request wrapper and types
│   ├── request.ts       # Main request handler
│   └── RequestTypes.ts  # Type definitions for API calls
└── styles/              # Global SCSS and variables
```

## Development Guidelines

### Component Standards

1.  **TypeScript Only**: All components must be written in `.tsx` with proper interfaces.
2.  **Structure**: Follow the folder structure:
    ```
    ComponentName/
      ├── ComponentName.tsx
      └── styles/
          └── ComponentName.module.scss
    ```
3.  **Styling**: Use **SCSS Modules** for component styling. Avoid inline `sx` props unless necessary for dynamic values.
4.  **Imports**: Use absolute imports with `@/` (e.g., `import { ... } from "@/components/..."`).

### Using Toast Notifications

For React Components, you can use the `useSnackbar` hook from `notistack`.
For non-component files (like API services), use the global `toastManager`:

```typescript
import { toastManager } from "@/lib/toastManager"

// Success
toastManager.addToast({ message: "Operation successful", type: "SUCCESS" })

// Error
toastManager.addToast({ message: "Something went wrong", type: "FAIL" })
```

### API Requests

Use the centralized `request` helper. It automatically handles:

- Content-Type headers
- Auth tokens
- Error parsing
- **Automatic Toast Notifications** for errors (can be disabled with `dontToast: true`)

```typescript
import request from "@/request/request"
import { API_URLS } from "@/constants/urls/API_URLS"

// Simple GET
const data = await request.get({ url: API_URLS.profile })

// POST with no error toast
await request.post({
  url: API_URLS.login,
  data: loginData,
  dontToast: true,
})
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

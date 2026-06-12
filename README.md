# NavalCommand

NavalCommand is a comprehensive, web-based military personnel management platform. Built originally as a system modernization effort, it replaces legacy manual spreadsheet tracking with a centralized, secure, and automated database. Designed specifically for cadet corps environments (e.g., NROTC), it handles personnel records, chain of command, attendance tracking, operational event management, and automated reporting.

## 🌟 Vision & Design

The core philosophy of NavalCommand is efficiency, strict access control, and a tactical, distraction-free user experience.

*   **Aesthetic:** Minimalist, "hacker/tactical" interface heavily inspired by technical wireframes and militaristic utility.
*   **Color Palette:** Deep dark grey and absolute black backgrounds, punctuated with high-contrast neon cyan (`#00FFFF`) accents for critical alerts and active states.

## 🛠 Tech Stack

*   **Frontend / Full-Stack:** [Next.js](https://nextjs.org) (App Router, Server Components)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com) (v4)
*   **Database & Backend:** [Supabase](https://supabase.com) (PostgreSQL)
*   **Authentication:** Supabase Auth (SSR configuration)
*   **Form Management:** React Hook Form + Zod validation
*   **Testing:** Jest, React Testing Library

## 🚀 Key Features

*   **Self-Service Registration Workflow:** Secure onboarding protocol enforcing uniqueness constraints on student IDs and emails, complete with Supabase Auth integration.
*   **Role-Based Access Control (RBAC):** Distinct functional hierarchies mapping to `Administrator`, `Officer`, and `Cadet` user types via Row Level Security (RLS).
*   **Command Dashboard:** Dynamic routing delivering role-specific metrics:
    *   **Cadets:** Personal attendance score, upcoming formation schedules, and active announcements.
    *   **Officers:** Unit strength, overall unit readiness (attendance average), and command actions.
*   **Automated Provisioning:** Postgres triggers automatically create system-wide `personnel_profiles` upon user verification.

## 🏗 Setup & Installation

First, clone the repository and install dependencies:

```bash
npm install
```

Configure your environment variables. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing

NavalCommand utilizes Jest for unit testing core logic and services. To execute the test suite:

```bash
npm run test
# or
npx jest
```

## 🗄 Database Migrations

Initial SQL schemas, custom Enums, tables, RLS policies, and triggers are located in the `supabase/migrations/` directory.

---
*Created as part of a system architecture redesign handoff and iteratively built via autonomous agency.*

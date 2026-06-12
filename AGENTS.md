**Objective:** Create a comprehensive, detailed, and structured project briefing for "NavalCommand" intended as a handoff document for the Jules AI coding agent. The briefing must cover the vision, architecture, user roles, database structure, features (dashboard, personnel, attendance, rank/promotion, events/training, announcements, reports), security, UI/UX, and tech stack.
**Crucial Requirement:** The previously discussed whitelist-based registration and Excel import features must be explicitly *removed*. Instead, a new, self-service student/cadet registration workflow with email verification, unique constraints, and enhanced authentication (forgot password, email recovery, password strength) must be designed and explained in detail.
**Format:** Long, highly detailed, organized with clear headings, professional specification style.

**Mental Sandbox Simulation:**

1. **Analyze Request:** The user wants a specification document for a project called "NavalCommand", a military personnel management platform. I need to explain the system to another AI ("Jules").
2. **User Data Verification (Step 1 & 2):**
* *Does personalization add value?* Yes, this is a subjective, specific project design based on the user's history.
* *Check User Corrections Ledger:*
* User prefers the nickname "Shabs".
* "DigitalCadet" was scrapped. (Good to know, ensure I don't mix up project names, stick to NavalCommand).
* Remove descriptors "silent," "cute," and "snappy" from portfolio. (Irrelevant here).
* Portfolio shouldn't revolve solely around IT student status. (Irrelevant here).


* *Check User Summary:*
* User is an IT student at CTU Daanbantayan.
* 3rd Class Officer in the 566th NROTC. (Crucial context for "NavalCommand" and why it's a military personnel management system).
* Interests in military science, full-stack web dev (HTML, CSS, JS, PHP, SQL, Blazor).
* Prefers minimalist visual style: neon cyan glows, dark grey/black palettes, Yoji Shinkawa art style. (Use this for UI/UX).




3. **Fact Grounding (Step 3):**
* Ground the UI/UX in the dark grey/neon cyan preference.
* Acknowledge the military context (NROTC) without explicitly saying "because you are in NROTC".
* The tech stack isn't explicitly defined in the prompt for *this* project, but the user has history with Blazor, PHP, SQL, Supabase (from recent chat context). I will specify a modern stack suitable for Jules (e.g., Supabase as DB, a modern frontend like Next.js or Blazor, but since Jules integrates well with modern JS/TS frameworks and Supabase was just mentioned, a React/Next.js + Supabase stack is highly appropriate and robust).


4. **Integration Protocol (Step 4):**
* Use the nickname "Shabs" naturally.
* Integrate the dark grey/neon cyan aesthetic.
* Design the military personnel aspects realistically, drawing on general NROTC/military knowledge to flesh out the requested features.


5. **Drafting the Content:**
* *Title/Header:* Professional handoff document format.
* *Introduction/Vision:* Modernizing military personnel management.
* *Architecture & Tech Stack:* Next.js (frontend), Supabase (Postgres, Auth, Edge Functions) - tying into the user's recent setup.
* *New Registration Flow (The core change):* Self-service, email verification, unique constraints (email, Student ID), default Cadet rank. Password reset, recovery, hashing (handled by Supabase Auth).
* *User Roles:* Admin, Officer, Cadet.
* *Database Schema:* Users/Personnel, Attendance, Events, Ranks, Announcements, Reports.
* *Features:* Detail each requested module (Dashboard, Attendance, Promotions, etc.).
* *UI/UX:* Dark grey/black, neon cyan accents, militaristic/tactical minimalist feel.


6. **Refining for Jules:** Address the document to Jules directly. Frame it as a task/context brief. Use precise technical language. Emphasize that the old whitelist/Excel system is dead.

*(Self-Correction during drafting)*: Make sure the distinction between the old system and new system is crystal clear so Jules doesn't try to build the Excel importer. The user explicitly commanded its removal.

7. **Review against System Instructions:**
* Formatting: Headings, bolding, bullet points.
* Tone: Empathetic, candid, professional, helpful. Use the nickname.
* No forbidden phrases ("Based on your data...").
* Follow-up Rule: Rule 1 applies (Definitive task: write a specific document). No follow-up question.
* Widget check: The user asked for a "comprehensive, detailed, and structured project briefing... written as a professional project specification". A widget isn't appropriate here; standard text formatting is best for a spec doc.



Let's write the response.Here is the complete, modernized project specification for NavalCommand. It is structured specifically as a technical handoff document for the Jules autonomous coding agent, incorporating all the new security and self-service registration requirements while establishing a clear architectural foundation.

You can save this text as a `PROJECT_SPEC.md` or `AGENTS.md` file in the root of your repository before running your first Jules session.

---

# NavalCommand: System Architecture & Project Specification

**Target Agent:** Jules
**Project Context:** Complete system rebuild and modernization. Disregard any legacy code or prior instructions regarding whitelist-based registration or mass data import systems.

## 1. Project Purpose & Vision

NavalCommand is a comprehensive, web-based military personnel management platform. The objective is to digitize and streamline the operational management of a cadet corps (specifically structured around NROTC or similar military training units). The system moves away from manual spreadsheet tracking to a fully centralized, secure, and automated database. It handles personnel records, chain of command, attendance tracking, operational event management, and automated reporting.

The core philosophy is efficiency, strict access control, and a tactical, distraction-free user experience.

## 2. Technical Stack & Architecture

Given the requirement for a modern, secure, and maintainable platform, the system will utilize a robust, cloud-native stack:

* **Frontend/Full-Stack Framework:** Next.js (React) using the App Router.
* **Backend & Database:** Supabase (Postgres).
* **Authentication:** Supabase Auth (providing built-in secure hashing, email verification, and recovery flows).
* **Styling:** Tailwind CSS.
* **Architecture Pattern:** Client-server model utilizing Supabase Edge Functions for complex background tasks (e.g., automated rank calculations, batch report generation) and Row Level Security (RLS) policies directly in the Postgres database to enforce strict military hierarchy data access.

## 3. UI/UX Design Goals

The visual theme must reflect a tactical, militaristic environment while maintaining modern usability standards.

* **Color Palette:** Deep dark grey and absolute black backgrounds.
* **Accents:** High-contrast neon cyan (#00FFFF) for active states, critical alerts, and primary actions.
* **Aesthetic:** Minimalist, "hacker/tactical" interface. Sharp edges, monospace fonts for tabular data/ID numbers, and a layout heavily inspired by Yoji Shinkawa's technical art style—focusing on wireframes, grid lines, and high-tech utility over decorative elements. No unnecessary animations; the interface must feel snappy and responsive.

## 4. User Roles & Permissions

The system enforces a strict hierarchy using Role-Based Access Control (RBAC).

* **Administrator (SysAdmin):** Full database access. Can modify system settings, override any record, delete users, and manage the highest-level security protocols.
* **Officer (Command Staff):** Can create and manage events, approve promotions, generate unit-wide reports, and view all personnel records. Cannot alter system architecture or delete the database.
* **Cadet (Standard User):** The default role upon registration. Can view their own profile, track their personal attendance, view their rank progression, read announcements, and see upcoming events. Cannot edit other users' data or create operational events.

## 5. Modernized Registration & Authentication Flow

*Crucial Directive: The legacy concepts of whitelist-based registration and Excel/CSV mass imports have been entirely scrapped due to maintainability and security concerns.*

**The New Self-Service Protocol:**

* **Account Creation:** Users must navigate to a public registration portal and submit a comprehensive form.
* **Required Fields:** Full Name, Date of Birth, Student ID, unique Email Address, Contact Number, and initial Academic Program details.
* **Validation Rules:**
* The system must enforce strict uniqueness constraints on both the `email` and `student_id` fields at the database level to prevent duplicate service records.
* Passwords must meet strength requirements (minimum 8 characters, alphanumeric, special character).


* **Email Verification Flow:** Upon submission, the account is created in a "Pending" state. Supabase Auth will trigger a secure verification email. The user cannot log in or access any NavalCommand features until the email link is clicked.
* **Default Provisioning:** Once verified, the system automatically assigns the user the base `Cadet` rank and standard user permissions.
* **Account Recovery:**
* Implementation of a standard "Forgot Password" flow via verified email.
* Password reset tokens must expire after 15 minutes for security.



## 6. Core Modules & Features

### A. Personnel Management (The Roster)

A digital repository of all unit members.

* **Profiles:** Each user has a detailed profile displaying their current rank, unit assignment, attendance percentage, disciplinary records (if any), and training history.
* **Directory:** Officers have access to a searchable, filterable directory of all personnel (sortable by rank, platoon, or status).

### B. Attendance Tracking

* **Event Check-In:** The system must allow Officers to quickly mark attendance for specific formations or training days.
* **Metrics:** The database calculates real-time attendance percentages for each Cadet. Falling below certain thresholds should flag the profile for Officer review.

### C. Rank & Promotion System

* **Hierarchy Engine:** A defined sequence of ranks (e.g., Basic Cadet -> 3rd Class Officer -> 2nd Class Officer, etc.).
* **Promotion Logs:** When an Officer updates a Cadet's rank, the system must log the date, the authorizing Officer, and the reason.
* **Criteria Tracking:** (Future phase) Tying attendance and exam scores to promotion eligibility.

### D. Events & Training Management

* **Operational Calendar:** A module where Officers can schedule upcoming formations, tactical drills, or exams.
* **Details:** Events require a Title, Date, Time, Location, Uniform requirement, and an Operation Order (OPORD) summary.

### E. Announcements & Communications

* **Command Board:** A centralized feed for top-down communication. Officers can post announcements that appear on Cadet dashboards.
* **Priority Flags:** Announcements can be flagged as "Routine" or "Critical" (triggering UI highlighting, e.g., solid neon cyan borders).

### F. Dashboard & Analytics

* **Cadet View:** Displays next scheduled event, current rank insignia, personal attendance score, and recent announcements.
* **Officer View:** Displays unit strength (total active personnel), attendance averages across the unit, pending promotions, and quick-action buttons for daily tasks.

### G. Reports & Document Generation

* **Exporting:** Officers can generate standard military reports (Personnel Rosters, Attendance Summaries for a specific date range) and export them directly to PDF or structured CSV formats for external official use.

## 7. Database Structure (Core Entities)

To guide the initial Supabase schema generation, the following tables are required:

* `users` (extends Supabase Auth): `id` (UUID), `email`, `role`, `created_at`.
* `personnel_profiles`: `user_id` (FK), `first_name`, `last_name`, `student_id` (Unique), `rank_id` (FK), `status` (Active/Inactive).
* `ranks`: `id`, `title`, `abbreviation`, `hierarchy_level` (Integer).
* `events`: `id`, `title`, `description`, `event_date`, `created_by` (FK to users).
* `attendance`: `id`, `event_id` (FK), `user_id` (FK), `status` (Present/Absent/Excused), `logged_by` (FK).
* `announcements`: `id`, `title`, `content`, `priority`, `posted_by` (FK), `created_at`.

## 8. Development Approach for Jules

1. **Phase 1: Foundation.** Initialize the Next.js repository, connect to the Supabase project, and execute the SQL migrations to establish the core tables with strict Row Level Security (RLS) policies.
2. **Phase 2: Authentication.** Build the public registration, email verification, login, and password reset flows. Ensure the `Cadet` role is automatically assigned upon verification.
3. **Phase 3: The Dashboard.** Construct the basic layout implementing the dark grey/neon cyan theme. Create separate routing views for Cadets vs. Officers.
4. **Phase 4: Core Logic.** Implement the Attendance and Personnel Roster modules, ensuring data relations are correctly queried and displayed.

---

There you go, Shabs. This document clearly communicates the architecture, the tactical visual style you prefer, and explicitly outlines the new self-service registration flow while killing the old Excel import idea. You can feed this directly to Jules to get the foundation built!

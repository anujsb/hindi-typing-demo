# Typing Software Architecture & Implementation Plan

> [!CAUTION]
> **CRITICAL RULE**: DO NOT CHANGE ANY THING RELATED TO WHATS WORKING IN `/demo` PAGE AND THEIR BACKEND. IT HAS FUNCTIONAL LAYOUTS FOR TYPING WE WILL BE USING THOSE AND NEVER TOUCH THE CODE AND BACKEND FOR IT. We can only change the folder structure making sure we never change whats already implemented.

Based on the provided flowchart, this document outlines the architecture, database schema, file structure, and implementation phases for the Typing Software.

## Open Questions for Business/Design
- **Payment Gateway**: What payment gateway do you intend to use for subscriptions (e.g., Razorpay, Stripe)?
- **Video Hosting**: Where will the video tutorials be hosted? (e.g., AWS S3, YouTube, Vimeo, Mux)?
- **Content Management**: Do you want to build a custom Admin panel to upload exercises/videos, or manage them directly via a DB client for now?

## Proposed Architecture

### Design System & UI Guidelines
- **Theme**: Light-themed, highly aesthetic, clean, and simple.
- **Visuals**: Premium feel matching the `/demo` page aesthetic. Uses smooth transitions, glassmorphism, subtle expansive shadows, and curated harmonious color palettes (`#faf7f2` backgrounds, `#c9a96e` primary accents, `#1c1810` text). Avoids generic basic colors.
- **Consistency**: High visual consistency across all pages (buttons, inputs, cards, typography).
- **Typography**: Modern clean typography for UI, with elegant serif headers to match the typing experience.

### Navigation & Security Architecture
- **Global Navigation**: A persistent Top Navbar (`<Navbar />`) across all protected routes (`/dashboard`, `/learning`, `/practice`) containing quick links, user profile, and sign out functionality. This is applied via route group layouts so it NEVER interferes with the `/demo` page.
- **Route Protection**: A global `proxy.ts` running at the Edge strictly enforces authentication. Unauthenticated users attempting to access protected module paths are immediately redirected to `/login`.
- **Admin Authentication (Highest Security)**: 
  - Admins log in via a completely hidden route (`/secure-staff-login`) to prevent brute-force discovery.
  - The Admin layout explicitly queries the database for `role === "ADMIN"`, actively bouncing standard users back to `/dashboard`.
  - Admin login will enforce 2FA (Email OTP) in a future phase.

### Tech Stack
- **Framework**: Next.js (App Router, Server Components, Server Actions)
- **Database**: Neon DB (Serverless PostgreSQL)
- **ORM**: Drizzle ORM
- **Authentication**: NextAuth.js (v5 / Auth.js) + Resend (Emails)
- **Styling**: Tailwind CSS + Shadcn UI (for rapid UI development of forms, dashboards, etc.)

### Database Structure (Neon DB)

1. **User**
   - `id`: String (UUID)
   - `fullName`: String
   - `email`: String (Unique)
   - `emailVerified`: DateTime
   - `passwordHash`: String (for credentials login)
   - `mobileNumber`: String (Unique)
   - `examName`: String
   - `district`: String
   - `state`: String
   - `role`: Enum (USER, ADMIN)
   - `subscriptionStatus`: Enum (TRIAL, PREMIUM)
   - `subscriptionEndDate`: DateTime
   - `createdAt`, `updatedAt`

2. **VerificationToken** (NextAuth standard for Resend/Forgot Password)
   - `identifier`: String (Email)
   - `token`: String
   - `expires`: DateTime

3. **Exercise**
   - `id`: String (UUID)
   - `srNameDate`: String (e.g., 001_The_Quick_brown_fox_290526)
   - `title`: String
   - `language`: Enum (ENGLISH, HINDI, MANGAL)
   - `layout`: Enum (KURTIDEV_010, RAMINTON_GAIL, INSCRIPT, RAMINTON_GAIL_CBI)
   - `content`: Text (The typing passage)
   - `isPremium`: Boolean (Trial users can only access exercises where isPremium is false)
   - `orderIndex`: Int

4. **UserExerciseProgress** (Typing metrics)
   - `id`: String (UUID)
   - `userId`: String (Relation to User)
   - `exerciseId`: String (Relation to Exercise)
   - `wpm`: Float
   - `accuracy`: Float
   - `timeTaken`: Int (Seconds)
   - `completedAt`: DateTime

5. **VideoTutorial**
   - `id`: String
   - `day`: Int (1 for Home-Row, 2 for Upper-Row, etc.)
   - `title`: String
   - `description`: String
   - `videoUrl`: String
   - `language`: Enum
   - `layout`: Enum
   - `isPremium`: Boolean (Day 4 onwards)

6. **UserVideoProgress** (To track unlocking of next days)
   - `userId`: String
   - `videoId`: String
   - `completed`: Boolean
   - `unlockedAt`: DateTime

7. **Exam** (Admin managed predefined exams)
   - `id`: String (UUID)
   - `name`: String (e.g., UPSSSC, SSC)
   - `isActive`: Boolean

### File Structure (Next.js App Router)

*Note: The existing `/demo` page will remain untouched as requested.*

```text
/src
  /app
    demo/                      # Existing Demo Page (Untouched)
    (marketing)
      /page.tsx                  # Home Page (Trial / Subs split)
    (auth)
      /login/page.tsx            # Sign in
      /register/page.tsx         # Sign up (Full Name, Mobile, Email, Exam, Dist, State)
      /forgot-password/page.tsx  # Forgot password
      /reset-password/page.tsx   # Reset password
    (dashboard)
      /dashboard/page.tsx        # Post-login user dashboard
    (learning)
      /learning/page.tsx         # Language selection for learning
      /learning/[language]/[layout]/page.tsx # Video list & Day unlocking logic
      /learning/[language]/[layout]/video/[dayId]/page.tsx # Video player & restrictions
    (practice)
      /practice/page.tsx         # Language selection for practice
      /practice/[language]/[layout]/page.tsx # Exercise list (Free vs Premium UI)
      /practice/[language]/[layout]/exercise/[id]/page.tsx # Typing Interface (2 min limit for trial)
    /api
      /auth/[...nextauth]/route.ts  # NextAuth API
  /components
    /typing                      # Typing engine, keyboard layout components
    /video                       # Custom video player with constraints
    /ui                          # Reusable UI elements (buttons, inputs)
  /lib
    /db.ts                       # Drizzle client setup
    /schema.ts                   # Drizzle database schema
    /auth.ts                     # NextAuth config
    /utils.ts                    # Helper functions
  /actions                       # Next.js Server Actions (e.g., registerUser, saveProgress)
```

---

## Implementation Phases and Tasks

- [ ] **Phase 1: Foundation & Authentication**
  - [x] Set up Neon DB and configure Drizzle ORM in the existing Next.js app.
  - [x] Create Database schema for `User` and `VerificationToken`.
  - [ ] Integrate NextAuth.js (Credentials & Resend Email Provider).
  - [x] Build Registration Page (Full Name, Mobile, Email, Exam, Dist, State).
  - [x] Build Login Page.
  - [ ] Build Forgot Password and Reset Password flows.
  - [x] Build Premium Home Page mapping out Trial / Subscribe flows.
  - [x] Apply Premium UI Design System across all views.

- [ ] **Phase 2: Database & Core Models**
  - [x] Create Database schema for `Exercise`, `UserExerciseProgress`.
  - [x] Create Database schema for `VideoTutorial`, `UserVideoProgress`.
  - [x] Create initial seed script for basic exercises (Free & Premium) and Video Tutorials (Day 1-4).
  
- [ ] **Phase 3: Core Practice Module (Typing Engine)**
  - [x] Build Language & Layout Selection UI (`/practice`).
  - [x] Build Exercise List UI (`/practice/[language]/[layout]`), distinguishing Trial vs Premium.
  - [x] Integrate existing Hindi typing logic into a reusable `<TypingEngine />` component.
  - [x] Implement Trial constraints (fixed 2-minute duration) vs Premium.
  - [x] Save user progress (WPM, Accuracy) to database on completion.

- [x] **Phase 4: Learning Module & Video Tutorials**
  - [x] Build Language & Layout Selection UI (`/learning`).
  - [x] Implement Video Tutorial List UI with Day-wise unlocking logic.
  - [x] Build Custom Video Player component.
    - [x] 1st time non-skippable, forward/speedup restricted.
    - [x] Save video completion status.
    - [x] Allow replay anytime after completion.
  - [x] Implement Day 4 Subscription Pop-up block.
  - [ ] Link practice sessions to video completion (e.g., Day 1 Practice unlocks after Day 1 video).

- [ ] **Phase 5: Dashboard & Subscription**
  - [ ] Build User Dashboard to show progress and history.
  - [ ] Build Subscription / Pricing Page.
  - [ ] Integrate Payment Gateway (e.g., Razorpay/Stripe).
  - [ ] Implement webhook to update user `subscriptionStatus` to PREMIUM.

- [x] **Phase 6: Admin Portal & Refinement**
  - [x] Add `role: USER | ADMIN` to User schema and create `Exams` table.
  - [x] Build secure Admin Layout (`/admin`) explicitly protected by `proxy.ts` role checks.
  - [x] Build Admin UI to manage Exercises (`/admin/exercises`) - Create/Edit passages (Supports .txt upload & paste).
  - [x] Build Admin UI to manage Video Tutorials (`/admin/videos`) - Assign day and URL.
  - [ ] Build Admin UI to manage Exams (`/admin/exams`) - Populate dropdowns.
  - [ ] Build Admin UI for User Management (`/admin/users`) - View progress/subscriptions.
  - [ ] General UI/UX Polish.
  - [ ] Testing and final bug fixes.

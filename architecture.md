# Typing Software Architecture & Implementation Plan

> [!CAUTION]
> **CRITICAL RULE**: DO NOT CHANGE ANY THING RELATED TO WHATS WORKING IN `/demo` PAGE AND THEIR BACKEND. IT HAS FUNCTIONAL LAYOUTS FOR TYPING WE WILL BE USING THOSE AND NEVER TOUCH THE CODE AND BACKEND FOR IT. We can only change the folder structure making sure we never change whats already implemented.

Based on the provided flowchart, this document outlines the architecture, database schema, file structure, and implementation phases for the Typing Software.

## Open Questions for Business/Design
- **Payment Gateway**: What payment gateway do you intend to use for subscriptions (e.g., Razorpay, Stripe)?
- **Video Hosting**: Where will the video tutorials be hosted? (e.g., AWS S3, YouTube, Vimeo, Mux)?
- **Content Management**: Do you want to build a custom Admin panel to upload exercises/videos, or manage them directly via a DB client for now?

## Proposed Architecture

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
  - [ ] Set up Neon DB and configure Drizzle ORM in the existing Next.js app.
  - [ ] Create Database schema for `User` and `VerificationToken`.
  - [ ] Integrate NextAuth.js (Credentials & Resend Email Provider).
  - [ ] Build Registration Page (Full Name, Mobile, Email, Exam, Dist, State).
  - [ ] Build Login Page.
  - [ ] Build Forgot Password and Reset Password flows.

- [ ] **Phase 2: Database & Core Models**
  - [ ] Create Database schema for `Exercise`, `UserExerciseProgress`.
  - [ ] Create Database schema for `VideoTutorial`, `UserVideoProgress`.
  - [ ] Create initial seed script for basic exercises (Free & Premium) and Video Tutorials (Day 1-4).
  
- [ ] **Phase 3: Core Practice Module (Typing Engine)**
  - [ ] Build Language & Layout Selection UI (`/practice`).
  - [ ] Build Exercise List UI (`/practice/[language]/[layout]`), distinguishing Trial vs Premium.
  - [ ] Integrate existing Hindi typing logic into a reusable `<TypingEngine />` component.
  - [ ] Implement Trial constraints (fixed 2-minute duration) vs Premium.
  - [ ] Save user progress (WPM, Accuracy) to database on completion.

- [ ] **Phase 4: Learning Module & Video Tutorials**
  - [ ] Build Language & Layout Selection UI (`/learning`).
  - [ ] Implement Video Tutorial List UI with Day-wise unlocking logic.
  - [ ] Build Custom Video Player component.
    - [ ] 1st time non-skippable, forward/speedup restricted.
    - [ ] Save video completion status.
    - [ ] Allow replay anytime after completion.
  - [ ] Implement Day 4 Subscription Pop-up block.
  - [ ] Link practice sessions to video completion (e.g., Day 1 Practice unlocks after Day 1 video).

- [ ] **Phase 5: Dashboard & Subscription**
  - [ ] Build User Dashboard to show progress and history.
  - [ ] Build Subscription / Pricing Page.
  - [ ] Integrate Payment Gateway (e.g., Razorpay/Stripe).
  - [ ] Implement webhook to update user `subscriptionStatus` to PREMIUM.

- [ ] **Phase 6: Refinement & Admin**
  - [ ] General UI/UX Polish (Dark mode, animations).
  - [ ] Admin panel (or script) to easily add new exercises with `SR_NAME_DATE` format.
  - [ ] Testing and final bug fixes.

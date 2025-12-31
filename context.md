# Project Context: Bistro Admin Dashboard ("Command Center")

## 1. Project Overview
**Name:** `bistro-admin`
**Type:** Mobile-First Web Dashboard (PWA)
**Purpose:** Serves as the "Command Center" for the Bistro/Lounge Manager. It allows them to control the WhatsApp Bot's data in real-time and monitor customer feedback.
**Relationship:** This is a **Frontend-Only** application that connects to the **SAME PostgreSQL Database** (hosted on Railway) used by the existing WhatsApp Bot (`bistro-bot`).

---

## 2. Tech Stack & Architecture
* **Framework:** Next.js 14 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **UI Components:** Shadcn/UI (Radix Primitives) + Lucide React (Icons)
* **Database ORM:** Prisma (Must use the exact schema from the Bot repo)
* **Authentication:** Clerk (Strict "Owner-Only" access)
* **Hosting:** Vercel

---

## 3. Critical Integration Rule (The "Shared Brain")
This dashboard **DOES NOT** have its own independent database. It reads and writes to the Bot's live production database.
* **Rule:** The `prisma/schema.prisma` file in this project must be an exact copy of the one in the `bistro-bot` project to ensure compatibility.
* **Concurrency:** Updates made here (e.g., Price Change) must be reflected instantly in the database so the Bot serves the new data immediately.

---

## 4. Core Features (MVP)

### A. Authentication (Security)
* **Provider:** Clerk
* **Constraint:** The dashboard is private. Only specific email addresses (e.g., `owner@bistro.com`) should be allowed to access the app.
* **Middleware:** Protect all routes except `/sign-in`.

### B. Menu Manager (Mobile-First Design)
* **Goal:** Allow a manager walking the floor to "86" an item (mark out of stock) or change a price with one thumb.
* **UI Layout:**
    * **NOT** a spreadsheet/table view.
    * **YES** to a "Card List" view optimized for mobile screens.
* **Card Components:**
    * Item Name & Category
    * **Price Input:** Tap-to-edit number field.
    * **Stock Toggle:** Large Green/Grey Switch (Availability).
* **Search:** Instant search bar at the top to find "Tusker" quickly.
* **Actions:** Use Next.js Server Actions for instant DB updates (`revalidatePath`).

### C. Feedback Feed (Reviews)
* **Goal:** Triage customer sentiment in real-time.
* **UI Layout:** Scrolling feed (Social Media style).
* **Visual Logic:**
    * **High Rating (4-5):** Green accent/border.
    * **Low Rating (1-3):** Red accent/border.
* **Data Points:** Rating (Stars), Message, Table Number, Waiter Name, Timestamp.
* **Actions:** "Mark as Resolved" (for complaints).

---

## 5. Database Schema Reference
* **Menu Model:**
    * `id` (String, UUID)
    * `name` (String)
    * `price` (Int)
    * `category` (String)
    * `inStock` (Boolean) - *This is the toggle target*
* **Feedback Model:**
    * `id` (String, UUID)
    * `rating` (Int, 1-5)
    * `message` (String)
    * `type` (Enum: COMPLIMENT, COMPLAINT)
    * `status` (Enum: PENDING, RESOLVED)

---

## 6. Environment Variables Needed
```env
DATABASE_URL="postgresql://..."  # Must match the Railway Connection String
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="..."
CLERK_SECRET_KEY="..."
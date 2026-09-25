<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# SROKHOTEL UI Rules & Guidelines

## Core UX/UI Architecture Rules
1. **No Modals for CRUD Workflows**:
   - **Create, Edit, and Detail** views MUST ALWAYS be dedicated full pages.
   - Do NOT use popups or dialog modals for creating entities, editing entities, or viewing detailed records.
   - Every Create (`/create`), Edit (`/[id]/edit`), and Detail (`/[id]`) workflow must have its own direct URL and full-page layout.
   - Modals / dialogs should only be used for quick non-navigational micro-actions (such as simple confirmation prompts like "Are you sure you want to cancel?").

2. **System Separation**:
   - **Guest Portal (`src/app/(guest)/`)**: Public-facing booking engine (Search, Available Rooms, Room Details, Booking/Checkout, Booking Confirmation, My Booking lookup).
   - **Admin Management Portal (`src/app/(admin)/admin/`)**: Owner & front-desk operational PMS (Dashboard, Timeline Calendar, Bookings, Front Desk, Rooms, Housekeeping, Payments, Guests, Settings).

3. **Feature Modularization (`src/features/`)**:
   - Keep page files thin and put business UI components into corresponding feature folders under `src/features/guest/` and `src/features/admin/`.

## Strict Visual Design & Typography Rules (Minimal & Restrained Luxury)
1. **Typography Limits per Component/Item**:
   - **Maximum 3 Font Sizes**: Pick at most 3 font sizes across any card or component (e.g., `text-base` for title, `text-sm` for rates/key numbers, and `text-xs` for details). Never mix 4 or 5 different font sizes on the same item.
   - **Maximum 2 Font Weights**: Use strictly at most 2 font weights per component (e.g., `font-normal` (or `font-medium`) and `font-bold`). Never mix normal, medium, semibold, bold, and extrabold together.
2. **Color Limits (Maximum 3 Colors per Item)**:
   - Maximum 3 colors per card or item:
     1. Primary text / surface (`text-foreground`)
     2. Secondary muted text (`text-muted-foreground`)
     3. One single accent or status color (e.g., `text-primary` or the active status badge).
   - "Not too much color": Avoid rainbow borders, multicolored icon backgrounds, or competing color boxes on the same card. Keep the design calm, cohesive, and premium.
3. **Restrained Icon Usage ("Not always icon")**:
   - Do NOT put an icon next to every single word, metric, or label.
   - Rely on clean typography, hierarchy, and whitespace to communicate structure naturally.
   - Use icons only when functional and essential (e.g., primary action button or navigation).
4. **2D iOS Frosted Glass Aesthetic**:
   - Translucent backgrounds (25%–45% opacity), `backdrop-blur-xl`, delicate specular borders (`border-white/65 dark:border-white/15`), and soft ambient lighting.

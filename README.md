# Bible Reading Planner & Journal

A React app for planning a Bible reading order, logging daily reading
(reading-plan chapters plus separate Proverbs/Psalms tracking down to the
verse level), and viewing progress on a calendar. Public pages are
read-only; an admin dashboard (just you, for now) handles all data entry.

- **Frontend:** React + Vite, hash-based routing (works cleanly from a
  GitHub Pages subpath with no server rewrites).
- **Backend:** Firebase Authentication (who can log in) + Firestore
  (reading plan, journal entries, user roles). No custom server.
- **Images:** uploaded client-side straight to Cloudinary (an unsigned
  upload preset, since there's no backend to sign the request).
- **Hosting:** GitHub Pages, built and deployed by the included GitHub
  Actions workflow.

## One-time setup

### 1. Firebase project

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. **Build → Authentication → Get started → Sign-in method →** enable
   **Email/Password**.
3. **Build → Firestore Database → Create database** (start in production
   mode; the rules below lock it down properly).
4. **Project settings → General → Your apps → Add app → Web**. Copy the
   `firebaseConfig` values.
5. Deploy the security rules in `firestore.rules` (Firestore console →
   Rules tab → paste the contents of that file → Publish; or use the
   Firebase CLI: `firebase deploy --only firestore:rules`).

### 2. Create yourself as the first admin

There's no backend, so the very first admin account has to be bootstrapped
by hand (every admin after that can be added from the in-app **Manage
Users** page):

1. Firebase Console → Authentication → **Add user** → your email + a
   password.
2. Firebase Console → Firestore → start collection `users` → document ID =
   that user's **UID** (copy it from the Authentication tab) → add fields
   `email` (string, your email) and `role` (string, `admin`).

### 3. Cloudinary (image uploads)

1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. **Settings → Upload → Upload presets → Add upload preset.** Set
   **Signing Mode = Unsigned**. Note the preset name and your **Cloud
   name** (shown on the dashboard).

### 4. Local environment variables

```
cp .env.example .env
```

Fill in the Firebase and Cloudinary values from steps 1 and 3.

```
npm install
npm run dev
```

### 5. GitHub Pages deployment

This repo is set up as a **project site**, served at
`https://<your-username>.github.io/bible-app/`.

1. Repo **Settings → Pages → Source → GitHub Actions**.
2. Repo **Settings → Secrets and variables → Actions → New repository
   secret** — add each of these (same values as your `.env`):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_CLOUDINARY_CLOUD_NAME`
   - `VITE_CLOUDINARY_UPLOAD_PRESET`
3. Push to `main` — `.github/workflows/deploy.yml` builds and publishes
   automatically. (Firebase's client config isn't actually a secret — the
   real security boundary is `firestore.rules` — it's just kept out of
   source control here for convenience.)
4. Firebase Console → Authentication → Settings → **Authorized domains** →
   add `<your-username>.github.io` so login works from the deployed site.

## Card images on the home page

The home page links to Reading Plan / Calendar / Journal (and, when logged
in, the admin pages) as image tiles. Drop your own images into
`public/cards/` matching the filenames referenced in `src/pages/Home.jsx`
(`reading-plan.jpg`, `calendar.jpg`, `journal.jpg`, `edit-plan.jpg`,
`edit-journal.jpg`, `users.jpg`), or change the `imageSrc` paths there to
whatever you use.

## Data model (Firestore)

- `readingPlan/plan` — one document: `{ items: [{ book, chapter, order }] }`,
  the full reading order. Only chapters you've assigned an order to appear
  here — there's no notion of "N chapters per day."
- `journalEntries/{YYYY-MM-DD}` — one document per day (so at most one
  entry per day):
  ```
  {
    chaptersRead: [{ book, chapter }],
    proverbsRead: [{ chapter, verses: [numbers] }],
    psalmsRead: [{ chapter, verses: [numbers] }],
    focusLevel: 1-5,
    notes: "<p>HTML...</p>",
    chapterNotes: [{ book, chapter, note: "<p>HTML...</p>" }],
  }
  ```
- `users/{uid}` — `{ email, role: "admin" | "viewer" }`.

The journal entry editor computes "chapters I haven't read yet" by
subtracting every chapter that appears in any `chaptersRead` array (across
all entries) from the reading plan order — so the picker always shows the
next unread chapters, in plan order.

## Notes on scope decisions

- **Bible text:** no verse text is stored or displayed anywhere — only
  structural counts (which chapters/verses exist), which is
  translation-agnostic and copyright-safe. The verse-count data matches
  standard modern English versification (ESV, NIV, NASB all agree here).
- **Managing other users' passwords:** the Firebase client SDK can't reset
  another account's password directly (that requires the Admin SDK on a
  server, which this static-site architecture doesn't have). "Manage
  Users" instead sends Firebase's built-in password-reset email.
- **Creating a new user from the admin page** briefly signs that browser
  tab in as the newly created account (a client-SDK quirk) — just log back
  in as yourself afterward. This only affects the person adding the user.

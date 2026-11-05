# CHASKA

CHASKA is a responsive video-sharing app built with React, Vite, Tailwind CSS, and Firebase. It includes email/password authentication, a live Firestore video feed, uploads to Firebase Storage, profiles, follows, likes, comments, search, and a trending view.

## Run locally

1. Install Node.js 18+ and create a Firebase project.
2. In Firebase Console, enable **Authentication → Email/Password**, create a **Cloud Firestore** database, and enable **Storage**.
3. Copy `.env.example` to `.env.local` and fill in the Web App config from Firebase Project settings.
4. Install and start:

```bash
npm install
npm run dev
```

For a production bundle run `npm run build` and `npm run preview`.

## Firebase rules

Apply `firestore.rules` and `storage.rules` in the Firebase console before using uploads and social actions. The app expects the `users` collection, `videos` collection, and `videos/{videoId}/comments` subcollections. Firebase client configuration is public by design; secure access with Firebase Authentication and rules, and configure authorized domains in Firebase.

## Notes

The app does not include Firebase service-account credentials. User profiles are created on signup, uploaded video and thumbnail files are stored in Firebase Storage, and their metadata is stored in Firestore. Search and trending currently load the video collection and filter/rank client-side, suitable for an MVP-sized dataset.

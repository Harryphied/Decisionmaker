# Firebase Setup Instructions

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: "Quick Decision Maker"
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Click "Email/Password" → Enable → Save
   - **Google**: Click "Google" → Enable → Add your project support email → Save

## 3. Get Your Firebase Configuration

1. In your Firebase project, click the gear icon (⚙️) → "Project settings"
2. Scroll down to "Your apps" section
3. Click the web icon (</>) to add a web app
4. Enter app nickname: "Quick Decision Maker Web"
5. Check "Also set up Firebase Hosting" (optional)
6. Click "Register app"
7. Copy the Firebase configuration object

## 4. Update Your Code

Replace the placeholder configuration in `index.html` with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-actual-sender-id",
    appId: "your-actual-app-id"
};
```

## 5. Configure Authorized Domains

1. In Firebase Console → Authentication → Settings
2. Add your domain to "Authorized domains":
   - `localhost` (for development)
   - Your production domain (when you deploy)

## 6. Test Your Setup

1. Open your app in a browser
2. Try creating a new account with email/password
3. Try signing in with Google
4. Verify that the user email appears when logged in
5. Test the sign out functionality

## Security Rules (Optional)

If you plan to use Firestore for storing user decisions:

1. Go to Firestore Database in Firebase Console
2. Create database in test mode
3. Add security rules to protect user data

## Troubleshooting

### Common Issues:

1. **"Firebase App not initialized"**: Make sure you've replaced the config with your actual values
2. **Google Sign-in not working**: Check that Google provider is enabled and authorized domains are set
3. **CORS errors**: Make sure your domain is in the authorized domains list
4. **"Invalid API key"**: Double-check your Firebase configuration

### Getting Help:

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com/)

## Next Steps

Once authentication is working, you can:
- Add Firestore to save user decisions
- Implement user-specific decision history
- Add more authentication providers
- Deploy to Firebase Hosting

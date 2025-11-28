# 🚀 AYUSHYA Setup Guide

Complete step-by-step guide to get AYUSHYA running on your machine.

## ⚡ Quick Start (5 minutes)

### Step 1: Install Dependencies

```bash
cd /Users/saurabhyadav/Desktop/ayushyaa
npm install
```

### Step 2: Set Up MongoDB

**Option A: Use MongoDB Atlas (Easiest)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free" → Sign up
3. Create a free M0 cluster
4. Click "Database Access" → Add Database User
   - Username: `ayushya_user`
   - Password: (generate strong password)
   - Database User Privileges: Read and write to any database
5. Click "Network Access" → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm
6. Click "Database" → Connect → "Connect your application"
7. Copy the connection string:
   ```
   mongodb+srv://ayushya_user:<password>@cluster0.xxxxx.mongodb.net/ayushyaa?retryWrites=true&w=majority
   ```
8. Replace `<password>` with your actual password

**Option B: Local MongoDB**

```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0

# Your connection string:
# mongodb://localhost:27017/ayushyaa
```

### Step 3: Set Up Clerk Authentication

1. Go to https://clerk.com
2. Click "Get Started Free" → Sign up
3. Create a new application:
   - Name: "AYUSHYA"
   - Authentication: Email/Password (or add Google/GitHub)
4. Copy your API keys:
   - Dashboard → API Keys
   - Copy `Publishable Key` (starts with `pk_`)
   - Copy `Secret Key` (starts with `sk_`)
5. Set up webhook:
   - Dashboard → Webhooks → Add Endpoint
   - Endpoint URL: `https://your-domain.com/api/webhooks/clerk`
   - For local testing: Use ngrok or skip for now
   - Subscribe to events: `user.created`, `user.updated`, `user.deleted`
   - Copy Signing Secret (starts with `whsec_`)

### Step 4: Configure Environment Variables

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local`:
   ```env
   # MongoDB
   MONGODB_URI=mongodb+srv://ayushya_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ayushyaa

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
   CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxx
   CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
   
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. Save the file

### Step 5: Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser!

## ✅ Verify Setup

### Test 1: Landing Page
- Open http://localhost:3000
- You should see the AYUSHYA landing page
- Click "Get Started" → Should redirect to sign-up

### Test 2: Authentication
- Click "Get Started" or "Sign Up"
- Create an account with email/password
- Should redirect to `/dashboard`
- You should see "Welcome, [Your Name]!"

### Test 3: Create a Case
- On dashboard, click "New Case"
- Fill in:
  - Hospital Name: Apollo Hospitals
  - Location: New Delhi
  - Admission Date: Pick today's date
  - Chief Complaint: High fever
- Click "Create Case"
- Should redirect to case page

### Test 4: Database Connection
- Open MongoDB Compass (if using local) or Atlas dashboard
- Database: `ayushyaa`
- Collections should exist: `users`, `patientprofiles`, `cases`
- You should see your data

## 🔧 Troubleshooting

### Issue: "Cannot connect to MongoDB"

**Solution 1:** Check MongoDB is running
```bash
# macOS
brew services list
# Should show mongodb-community as started
```

**Solution 2:** Check connection string
- Make sure password is correct
- No special characters need to be URL-encoded
- Database name is included

**Solution 3:** Check network access (Atlas only)
- MongoDB Atlas → Network Access
- Ensure 0.0.0.0/0 is whitelisted

### Issue: "Clerk authentication not working"

**Solution 1:** Verify API keys
- Keys must start with `pk_` and `sk_`
- No extra spaces or quotes
- Keys match your Clerk dashboard

**Solution 2:** Check redirect URLs
- Sign in URL: `/sign-in`
- Sign up URL: `/sign-up`
- After sign in: `/dashboard`

**Solution 3:** Clear browser cache
```bash
# Hard refresh
Cmd+Shift+R (macOS)
Ctrl+Shift+R (Windows)
```

### Issue: "Webhook errors in console"

**For Development:** You can skip webhooks initially
- Comment out webhook secret in `.env.local`
- Webhooks are only needed for production

**For Production:** Use ngrok
```bash
# Install ngrok
brew install ngrok  # macOS
# or download from ngrok.com

# Start tunnel
ngrok http 3000

# Copy HTTPS URL (e.g., https://abc123.ngrok.io)
# Add to Clerk: https://abc123.ngrok.io/api/webhooks/clerk
```

### Issue: "Page not found" errors

**Solution:** Restart dev server
```bash
# Stop server: Ctrl+C
# Restart:
npm run dev
```

### Issue: TypeScript errors

**Solution:** Regenerate types
```bash
rm -rf .next
npm run dev
```

## 📱 Testing the App

### Create Demo Data

1. **Sign up** as a test user
2. **Create a case:**
   - Hospital: Max Healthcare
   - Location: Gurugram
   - Date: Today
   - Complaint: Chest pain
3. **View dashboard** - should show 1 active case
4. **Click on case** - should open (will build this next)

### Load Mock Events (Coming Soon)

Once we build the event loader:
```bash
# This will load mock/events.json into your case
npm run seed:events
```

## 🎯 Next Development Steps

Now that your foundation is set up, you can:

1. **Build Case Detail Page** - View full case information
2. **Implement BlackBox Timeline** - Show events with filtering
3. **Add Bill Upload** - Parse and analyze bills
4. **Create Insurance Optimizer** - Policy analysis
5. **Build Second Opinion** - AI-powered insights
6. **Generate Patient Summary** - PDF export

See `README.md` for detailed feature list.

## 🌐 Deploy to Production

### Deploy to Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   gh repo create ayushyaa --public --source=. --remote=origin
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to https://vercel.com
   - Click "Import Project"
   - Select your GitHub repo
   - Add environment variables (same as `.env.local`)
   - Click "Deploy"

3. **Update Clerk webhook:**
   - Copy Vercel URL (e.g., `https://ayushyaa.vercel.app`)
   - Clerk Dashboard → Webhooks
   - Update endpoint to: `https://ayushyaa.vercel.app/api/webhooks/clerk`

## 🛠️ Development Tools

### Recommended VS Code Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- MongoDB for VS Code
- Clerk Snippets

### Recommended Browser Extensions

- React Developer Tools
- Redux DevTools (for Zustand)
- JSON Viewer

### Database Tools

- MongoDB Compass (desktop app)
- Studio 3T (advanced features)
- MongoDB Atlas Web Interface

## 📞 Getting Help

If you're stuck:

1. Check the error message carefully
2. Verify all environment variables
3. Check MongoDB connection
4. Check Clerk dashboard for errors
5. Clear `.next` folder and restart
6. Check browser console for errors

---

Happy coding! 🚀

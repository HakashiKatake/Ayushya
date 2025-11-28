# 🏥 AYUSHYA - Hospital Transparency Platform

AI-powered hospital transparency tool for detecting billing fraud, optimizing insurance coverage, and providing healthcare insights.

## 📋 Project Overview

AYUSHYA is a full-stack Next.js application that helps patients:
- Track their complete hospital journey (Medical BlackBox)
- Detect billing fraud and overcharging
- Optimize insurance coverage
- Get AI-powered second opinions
- Generate doctor-friendly patient summaries

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Clerk account for authentication

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**

Copy `.env.example` to `.env.local` and fill in your credentials:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/ayushyaa
# Or use MongoDB Atlas: mongodb+srv://<username>:<password>@cluster.mongodb.net/ayushyaa

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_webhook_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Get Clerk Credentials

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Go to **API Keys** in dashboard
4. Copy `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
5. Go to **Webhooks** and create endpoint: `http://localhost:3000/api/webhooks/clerk`
6. Select events: `user.created`, `user.updated`, `user.deleted`
7. Copy the **Signing Secret** as `CLERK_WEBHOOK_SECRET`

### MongoDB Setup

**Option 1: Local MongoDB**
```bash
# Install MongoDB locally
brew install mongodb-community  # macOS
# or download from mongodb.com

# Start MongoDB
brew services start mongodb-community
```

**Option 2: MongoDB Atlas (Recommended)**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user
4. Whitelist your IP (or use 0.0.0.0/0 for development)
5. Get connection string and add to `.env.local`

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
ayushyaa/
├── app/
│   ├── api/
│   │   ├── cases/              # Case CRUD operations
│   │   └── webhooks/           # Clerk webhook handler
│   ├── dashboard/              # Main dashboard
│   │   └── cases/
│   │       └── new/            # Create new case
│   ├── sign-in/                # Clerk sign-in page
│   ├── sign-up/                # Clerk sign-up page
│   ├── layout.tsx              # Root layout with Clerk
│   └── page.tsx                # Landing page
├── components/
│   └── ui/                     # Shadcn UI components
├── lib/
│   ├── db.ts                   # MongoDB connection
│   ├── fraudDetection.ts       # Fraud analysis engine
│   ├── insuranceAnalysis.ts    # Insurance optimizer
│   └── utils.ts                # Utilities
├── models/                     # Mongoose models
│   ├── User.ts
│   ├── PatientProfile.ts
│   ├── Case.ts
│   ├── Event.ts
│   ├── Bill.ts
│   ├── BillItem.ts
│   ├── InsurancePolicy.ts
│   ├── SecondOpinionRequest.ts
│   └── PatientSummarySnapshot.ts
├── store/                      # Zustand state management
│   ├── caseStore.ts
│   ├── eventStore.ts
│   └── billStore.ts
├── mock/                       # Mock data for demo
│   ├── events.json
│   ├── standard_prices.json
│   ├── policy_rules.json
│   └── ai_responses.json
└── middleware.ts               # Clerk authentication middleware
```

## ✅ Completed Features

### Core Infrastructure
- ✅ Next.js 14 with TypeScript
- ✅ Tailwind CSS with Shadcn UI components
- ✅ MongoDB with Mongoose ODM
- ✅ Clerk authentication with webhooks
- ✅ Zustand state management
- ✅ Framer Motion animations

### Pages & Features
- ✅ Landing page with hero, features, and CTAs
- ✅ Authentication pages (Sign in/Sign up)
- ✅ Patient dashboard with case listing
- ✅ Create new case functionality
- ✅ Case API routes (CRUD operations)

### Business Logic
- ✅ Fraud detection engine with pricing analysis
- ✅ Insurance coverage optimizer
- ✅ Mock data for all features
- ✅ Database models for all entities

## 🚧 Next Steps to Complete

### 1. Case Detail Page with Tabs
**File:** `app/dashboard/cases/[id]/page.tsx`

Create tabbed interface showing:
- Overview (case details, fraud score)
- Medical BlackBox Timeline
- Documents
- Bills

### 2. Medical BlackBox Timeline
**File:** `app/dashboard/cases/[id]/blackbox/page.tsx`

Features needed:
- Event timeline with filtering
- Fraud flags (11:59 PM, duplicates, etc.)
- Event type icons and colors
- Mock data loading from `mock/events.json`

### 3. Bill Upload & Fraud Detection
**File:** `app/dashboard/cases/[id]/bills/page.tsx`

Features needed:
- File upload (image/PDF)
- Mock bill parsing
- Display fraud analysis results
- Show suspicious items with reasons
- Use `lib/fraudDetection.ts` engine

### 4. Insurance Optimizer
**File:** `app/dashboard/insurance/page.tsx`

Features needed:
- Upload insurance policy
- Link policy to case
- Show coverage breakdown
- Display warnings and exclusions
- Use `lib/insuranceAnalysis.ts` engine

### 5. Second Opinion
**File:** `app/dashboard/cases/[id]/second-opinion/page.tsx`

Features needed:
- Question type selection
- Display mock AI responses from `mock/ai_responses.json`
- Show treatment appropriateness
- List questions to ask doctor

### 6. Patient Summary Generator
**File:** `app/dashboard/cases/[id]/summary/page.tsx`

Features needed:
- Generate summary from case data
- Create PDF with jsPDF
- Include timeline, tests, diagnosis
- Download functionality

### 7. Admin Simulator
**File:** `app/admin/simulator/page.tsx`

Features needed:
- Add test/medication/doctor visit
- Trigger fraud scenarios
- Generate midnight events
- Add billing items

### 8. Additional API Routes Needed

```typescript
// app/api/events/route.ts - Create/list events
// app/api/events/[id]/route.ts - Get/update/delete event
// app/api/bills/route.ts - Upload/analyze bills
// app/api/bills/[id]/route.ts - Get bill details
// app/api/insurance/route.ts - Manage policies
// app/api/second-opinion/route.ts - Generate opinions
// app/api/summary/route.ts - Generate summaries
```

## 🎨 Design System

**Colors:**
- Primary: Blue 600 (#2563EB)
- Success: Green 500
- Warning: Yellow 500
- Danger: Red 500
- Background: Slate 50

**Typography:**
- Font: Geist Sans
- Headings: Bold
- Body: Regular

## 🔧 Utility Functions

### Fraud Detection
```typescript
import { analyzeBillForFraud } from '@/lib/fraudDetection';

const result = analyzeBillForFraud(billItems);
// Returns: fraudScore, overcharge estimates, suspicious items
```

### Insurance Analysis
```typescript
import { analyzeInsuranceCoverage } from '@/lib/insuranceAnalysis';

const analysis = analyzeInsuranceCoverage(billItems, 'basic_policy');
// Returns: covered amount, out-of-pocket, warnings
```

## 📊 Mock Data Usage

All features use mock data from the `mock/` directory:

- `events.json` - Sample hospital events (tests, meds, doctor visits)
- `standard_prices.json` - Expected price ranges for fraud detection
- `policy_rules.json` - Insurance policy templates
- `ai_responses.json` - Pre-generated AI responses

## 🐛 Development Tips

1. **Hot Reload:** Changes auto-reload in dev mode
2. **Database:** View data using MongoDB Compass
3. **Clerk:** Test webhooks using Clerk Dashboard
4. **Tailwind:** Use Tailwind IntelliSense VS Code extension
5. **Mock Data:** Start with mock data before adding real AI

## 📝 Environment Variables Checklist

Before deploying, ensure you have:
- [ ] MongoDB connection string
- [ ] Clerk publishable key
- [ ] Clerk secret key
- [ ] Clerk webhook secret
- [ ] Next.js app URL

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Add environment variables in Vercel dashboard.

### Docker
```bash
# Build image
docker build -t ayushya .

# Run container
docker run -p 3000:3000 ayushya
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Shadcn UI](https://ui.shadcn.com)
- [Zustand](https://github.com/pmndrs/zustand)
- [Framer Motion](https://www.framer.com/motion)

## 🤝 Contributing

This is a demo project. To extend it:
1. Add real AI integration (OpenAI, Gemini)
2. Implement actual OCR for bill parsing
3. Add real hospital integrations
4. Build mobile app version
5. Add data visualization charts

## 📄 License

MIT License - Feel free to use for learning and projects

## 👨‍💻 Support

For issues or questions:
1. Check the mock data files
2. Verify environment variables
3. Check MongoDB connection
4. Review Clerk webhook logs

---

Built with ❤️ using Next.js, TypeScript, and Modern Web Technologies

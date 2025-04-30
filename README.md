# Ad Analytics Dashboard

![Ad Analytics Dashboard](https://i.imgur.com/uZshILa.png)

A modern advertising analytics dashboard built with Next.js 14, Clerk Authentication, TailwindCSS, and shadcn/ui components. This application allows you to connect your Google Ads and Facebook Ads accounts to visualize campaign performance data in one place.

## 🚀 Features

- **Ad Platforms Integration**: Connect to Google Ads and Facebook Ads
- **Campaign Performance**: View impressions, clicks, CTR, and spend metrics
- **Modern UI/UX**: Beautiful, responsive design with glassmorphism effects
- **Authentication**: Secure user authentication powered by Clerk
- **Dashboard Analytics**: Interactive charts and visualization
- **Date Range Selection**: Filter data by different time periods
- **Theme Support**: Dark/Light mode toggle
- **Mobile-First Design**: Fully responsive interface for all devices
- **Data Export**: Export campaign data to CSV

## 🧰 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Authentication**: [Clerk](https://clerk.dev/) 
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Charts**: Recharts-based custom components
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: Google Outfit font
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- **Ad API Libraries**:
  - [Google Ads API](https://github.com/opteo/google-ads-api)
  - [Facebook Business SDK](https://github.com/facebook/facebook-nodejs-business-sdk)

## 📦 Installation

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Google Ads API access
- Facebook Marketing API access
- MongoDB Atlas account
- Clerk account

### Step-by-Step Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/ad-analytics-dashboard.git
cd ad-analytics-dashboard
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Set up Clerk Authentication**

   a. Create a [Clerk account](https://clerk.dev/sign-up) if you don't have one
   
   b. Create a new application:
      - Go to the Clerk Dashboard and click "Add Application"
      - Enter a name for your application
      - Select "Next.js" as the framework
   
   c. Configure OAuth providers (required for Google and Facebook connections):
      - In the Clerk Dashboard, go to "Authentication" → "Social Connections"
      - Enable Google and Facebook providers
      - Follow the instructions to set up each provider
   
   d. Configure redirect URLs:
      - In "Authentication" → "Redirects", set the following:
        - Sign-in: `/sign-in`
        - Sign-up: `/sign-up`
        - After sign-in: `/dashboard`
        - After sign-up: `/dashboard`

4. **Set up MongoDB Atlas**

   a. Create a [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas/register) if you don't have one
   
   b. Create a new project and cluster (the free tier works perfectly)
   
   c. Set up database access and network access

5. **Set up Google Ads API**

   a. Create a [Google Developer account](https://developers.google.com/google-ads/api/docs/first-call/overview)
   
   b. Create a new project in the Google Cloud Console
   
   c. Enable the Google Ads API
   
   d. Set up OAuth 2.0 credentials
   
   e. Apply for a developer token

6. **Set up Facebook Marketing API**

   a. Create a [Facebook Developer account](https://developers.facebook.com/)
   
   b. Create a new app
   
   c. Add the Marketing API product to your app
   
   d. Generate an access token with the necessary permissions

7. **Set up environment variables**

Create a `.env.local` file in the root directory based on the provided `.env.example`:

```
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# MongoDB Atlas
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=your_database_name

# Google Ads API
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_DEVELOPER_TOKEN=your-google-developer-token

# Facebook Ads API
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
```

8. **Run the development server**

```bash
npm run dev
# or
yarn dev
```

9. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📋 Key Pages

- **Dashboard** (`/dashboard`): Main overview of ad campaigns with performance metrics
- **Ad Accounts** (`/settings/accounts`): Manage connected Google Ads and Facebook Ads accounts
- **Analytics** (`/analytics`): Detailed analytics with interactive charts
- **Settings** (`/settings`): User profile and application settings

## 🌟 Custom Components

The application features several custom components:

- **Campaign Cards**: Display key metrics for each campaign
- **Date Range Selector**: Filter data by different time periods
- **Ad Account Selector**: Switch between different ad accounts
- **Charts**: Area, Bar, Line and Pie charts with responsive design
- **Header**: Responsive navigation with mobile drawer
- **Theme Toggle**: Light/Dark mode switcher

## 📱 Responsive Design

The application is built with a mobile-first approach and includes:

- Responsive navigation (collapsible sidebar on mobile)
- Fluid layouts that adapt to any screen size
- Optimized content display for different devices

## 🧩 Project Structure

```
ad-analytics-dashboard/
├── public/              # Static assets
├── src/
│   ├── app/             # App router pages
│   │   ├── dashboard/   # Dashboard page
│   │   ├── analytics/   # Analytics page
│   │   ├── settings/    # Settings page
│   │   └── ...
│   ├── components/      # Reusable components
│   │   ├── dashboard/   # Dashboard-specific components
│   │   ├── ui/          # shadcn/ui components
│   │   └── ...
│   ├── lib/             # Utility functions and shared logic
│   │   ├── api/         # API service layers
│   │   └── models/      # MongoDB schema models
│   └── ...
├── next.config.ts       # Next.js configuration
├── tailwind.config.js   # TailwindCSS configuration
└── ...
```

## 🚀 Deployment

This application can be easily deployed on:

- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [Railway](https://railway.app/)

## 🔒 Authentication Flow

The authentication is handled by Clerk and includes:

- Sign up/Sign in pages
- Protected routes
- User profile management
- Authentication middleware

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

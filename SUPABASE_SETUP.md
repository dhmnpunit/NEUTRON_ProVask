# Supabase Setup Guide

This guide will help you set up Supabase for the application's authentication and database needs.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in or create an account
2. Click "New Project" and fill in the details
3. Choose a name for your project
4. Set a secure database password
5. Choose a region close to your users
6. Click "Create new project"

## 2. Get API Credentials

1. Once your project is created, go to the project dashboard
2. In the left sidebar, click on "Project Settings" (the gear icon)
3. Click on "API" in the submenu
4. You'll find:
   - **Project URL**: Copy this to `supabaseUrl` in `lib/supabase.ts`
   - **anon/public** key: Copy this to `supabaseAnonKey` in `lib/supabase.ts`

## 3. Set Up Database Schema

### Option 1: Using the SQL Editor

1. In your Supabase dashboard, go to the "SQL Editor" in the left sidebar
2. Create a new query
3. Copy the contents of `supabase/migrations/20230610000000_init.sql`
4. Run the query to create all necessary tables and policies

### Option 2: Using Supabase CLI (for development)

1. Install Supabase CLI if you haven't already
   ```
   npm install -g supabase
   ```
2. Login to Supabase
   ```
   supabase login
   ```
3. Initialize Supabase in your project (if not already done)
   ```
   supabase init
   ```
4. Link to your remote project
   ```
   supabase link --project-ref <your-project-ref>
   ```
5. Apply migrations
   ```
   supabase db push
   ```

## 4. Configure Authentication

1. In your Supabase dashboard, go to "Authentication" in the left sidebar
2. Under "Email Templates", you can customize the emails sent to users
3. Under "URL Configuration", set your site URL and redirect URLs
4. If needed, you can enable additional providers like Google, GitHub, etc.

## 5. Update Your Application

1. Open `lib/supabase.ts` in your application
2. Replace the placeholder values with your actual Supabase URL and anon key
   ```typescript
   const supabaseUrl = 'YOUR_SUPABASE_URL';
   const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
   ```

## Testing Authentication

Once set up, you should be able to:
1. Sign up with email and password
2. Receive a confirmation email (if email confirmation is enabled)
3. Log in with email and password
4. Access protected resources based on RLS policies

## Database Schema

The application uses the following main tables:

1. **profiles** - User profiles linked to Supabase Auth
2. **journal_entries** - Journal entries created by users
3. **health_metrics** - Health data linked to journal entries

Each table has Row Level Security (RLS) policies to ensure users can only access their own data. 
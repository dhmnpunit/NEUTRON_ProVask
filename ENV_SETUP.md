# Environment Variables Setup

This application uses environment variables to securely store configuration settings. Follow these steps to set up your environment:

## Setting Up Environment Variables

1. Create a `.env` file in the root of your project:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and replace the placeholder values with your actual Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
   ```

3. Get your Supabase credentials:
   - Go to your Supabase project dashboard
   - Navigate to Project Settings > API
   - Copy the URL under "Project URL" 
   - Copy the "anon" key under "Project API keys"

## Important Notes

- **Never commit your `.env` file to version control**. It contains sensitive information.
- The `.env` file has been added to `.gitignore` to prevent accidental commits.
- Use `.env.example` as a template to show what environment variables are required without exposing actual values.
- For production deployments, set these environment variables in your hosting provider's settings.

## Environment Variables Used

- `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous/public API key

## Troubleshooting

If you encounter errors related to environment variables:

1. Make sure the `.env` file exists in the root of your project
2. Verify that the variable names match exactly (including case)
3. Check that your Supabase URL and anon key are correct
4. Restart your development server after making changes to environment variables

For Expo development, you may need to restart the Expo development server when changing environment variables, as they are loaded at build time. 
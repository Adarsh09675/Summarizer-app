# Summarizer App

An AI-powered text summarization application built with Next.js, featuring user authentication, admin panel, and integration with Google's Gemini AI for generating concise summaries.

## Features

- **AI-Powered Summarization**: Uses Google's Gemini 2.0 Flash model to generate efficient and concise text summaries
- **User Authentication**: Secure login/signup system powered by Supabase Auth
- **Admin Panel**: Manage users and articles with role-based access control
- **Article Management**: Create, view, and manage articles with summaries
- **Responsive Design**: Modern UI built with Tailwind CSS and Radix UI components
- **Real-time Updates**: Live updates and interactions using Supabase real-time features

## Screenshots

### User Dashboard
![User Dashboard](screenshot/Screenshot%202026-04-24%20135812.png)
*The main dashboard for authenticated users, showing user data and available features.*

### Login Page
![Login Page](screenshot/Screenshot%202026-04-24%20135951.png)
*The login page where existing users can sign in to access the application.*

### Signup Page
![Signup Page](screenshot/Screenshot%202026-04-24%20140055.png)
*The signup page where new users can create an account to join the application.*

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Supabase (Database, Auth, Real-time)
- **AI**: Google Gemini AI
- **Deployment**: Vercel (recommended)

## Prerequisites

- Node.js 18+ and pnpm
- Supabase account
- Google AI Studio API key

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd summarizer-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**

   Copy the `.env.local` file and configure the following variables:

   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Gemini AI Configuration
   GEMINI_API_KEY=your_gemini_api_key
   GEMINI_MODEL=gemini-2.0-flash-exp
   ```

   **Getting API Keys:**

   - **Supabase**: Create a project at [supabase.com](https://supabase.com) and get the URL and keys from Settings > API
   - **Gemini API**: Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to create an API key

4. **Database Setup**

   Run the SQL setup script in your Supabase SQL editor (refer to `supabase_setup.sql` if you have it, or set up tables manually):
   - `profiles` table for user data
   - `articles` table for content management

## Running the Application

1. **Development Server**
   ```bash
   pnpm dev
   ```

2. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### For Users
- Sign up or log in to access the dashboard
- View available articles and their summaries
- Request new summaries for text content

### For Admins
- Access the admin panel at `/admin`
- Manage user accounts (view, block/unblock)
- Create and manage articles
- Monitor application usage

## Configuration

### Changing the Gemini Model

Edit the `GEMINI_MODEL` variable in your `.env.local` file to use different Gemini models:

```env
GEMINI_MODEL=gemini-1.5-flash  # Faster, less accurate
GEMINI_MODEL=gemini-1.5-pro    # More accurate, slower
GEMINI_MODEL=gemini-2.0-flash-exp  # Latest experimental model
```

Restart the development server after changing environment variables.

## Project Structure

```
summarizer-app/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   └── api/               # API routes (if any)
├── components/            # Reusable React components
│   ├── ui/               # UI components (buttons, inputs, etc.)
│   └── ...               # Feature-specific components
├── utils/                 # Utility functions
│   ├── gemini.ts         # Gemini AI integration
│   ├── supabase/         # Supabase client configurations
│   └── cn.ts             # Class name utility
├── public/                # Static assets
└── ...                    # Configuration files
```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- Self-hosted with Docker

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `GEMINI_MODEL` | Gemini model name | No (defaults to gemini-2.0-flash-exp) |

## Troubleshooting

### Common Issues

1. **Gemini API Errors**
   - Verify your API key is correct
   - Check if the model name is valid
   - Ensure billing is enabled in Google Cloud (if applicable)

2. **Supabase Connection Issues**
   - Confirm environment variables are set correctly
   - Check Supabase project status
   - Verify database tables exist

3. **Build Errors**
   - Run `pnpm install` to ensure dependencies are installed
   - Check TypeScript errors with `pnpm lint`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue on the GitHub repository or contact the maintainers.

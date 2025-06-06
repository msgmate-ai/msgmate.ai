# MsgMate.AI 🚀

Your Personal AI Wingmate for Confident Dating

## Overview

MsgMate.AI is an advanced AI-powered dating communication platform that helps users craft better messages with confidence, charm, and authenticity. The app features intelligent message generation and sophisticated user experience design to facilitate meaningful dating conversations.

## Features

### Core Functionality
- **Say It Better Mode**: Enhances and improves user's draft messages
- **Help Me Craft Mode**: Generates thoughtful replies based on received messages
- **Tone Selection**: Multiple conversation tones (casual, flirty, confident, etc.)
- **Message Analysis**: Provides feedback on message tone and effectiveness

### Additional Tools
- **Message Coach**: Analyzes message tone, clarity, and emotional impact
- **Message Decoder**: Interprets received messages and suggests response strategies
- **Conversation Starters**: Generates engaging opening messages

## Tech Stack

### Frontend
- **React.js** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/UI** component library
- **Wouter** for routing
- **TanStack Query** for data fetching
- **React Hook Form** with Zod validation

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** database with Drizzle ORM
- **Passport.js** for authentication
- **Stripe** for subscription management
- **OpenAI** for AI-powered message generation
- **Twilio** for SMS verification

### Infrastructure
- **Vite** for development and build
- **Node.js** runtime environment
- **Session-based authentication**
- **Database migrations with Drizzle**

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- OpenAI API key
- Stripe account (for payments)
- Twilio account (for SMS verification)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/msgmateai/msgmate.ai.git
cd msgmate.ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Configure the following environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `TWILIO_ACCOUNT_SID` - Twilio account SID
- `TWILIO_AUTH_TOKEN` - Twilio auth token
- `SESSION_SECRET` - Session encryption secret

4. Set up the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
msgmate.ai/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
├── server/                # Backend Express application
│   ├── auth.ts           # Authentication logic
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Database operations
│   └── openai.ts         # AI integration
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema definitions
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/register` - User registration
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user

### AI Features
- `POST /api/generate-replies` - Generate message replies
- `POST /api/analyze-message` - Analyze message tone
- `POST /api/decode-message` - Decode message intent
- `POST /api/conversation-starters` - Generate conversation starters

### Subscriptions
- `GET /api/subscription` - Get user subscription
- `POST /api/create-checkout-session` - Create Stripe checkout
- `POST /api/stripe-webhook` - Handle Stripe webhooks

### Waitlist
- `POST /api/waitlist` - Join beta waitlist

## Database Schema

The application uses PostgreSQL with Drizzle ORM. Key tables include:

- **users** - User accounts and authentication
- **subscriptions** - User subscription plans and usage
- **waitlist** - Beta testing waitlist

## Deployment

The application is designed to run on Replit with automatic deployments. For other platforms:

1. Set up environment variables
2. Configure PostgreSQL database
3. Run `npm run build` for production build
4. Start with `npm start`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For support and questions:
- Email: support@msgmate.ai
- GitHub Issues: [Report a bug](https://github.com/msgmateai/msgmate.ai/issues)

---

Made with ❤️ for better dating conversations
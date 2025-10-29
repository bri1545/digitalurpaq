# Дворец школьников "Digital Urpaq" - Petropavlovsk

## Project Overview
An interactive web application for Дворец школьников "Digital Urpaq" (Цифровой Урпақ) in Petropavlovsk, Kazakhstan. Features an AI-powered assistant that helps students discover clubs, take interest quizzes, chat with AI about programs, register for activities, and navigate the facility.

## Facility Information
- **Name**: Дворец школьников "DIGITAL URPAQ"
- **Website**: https://digitalurpaq.edu.kz
- **Location**: Petropavlovsk, Kazakhstan
- **Address**: V438+J5W, ул. Таштинова, Петропавловск 150000
- **Coordinates**: 54.8537°N, 69.1458°E
- **Google Maps**: https://www.google.com/maps/place/54.8537,69.1458
- **Phone**: Приемная: +7 (7152) 34-02-40, Ресепшн: +7 (7152) 50-17-03
- **Description**: One of the largest institutions of additional education in Petropavlovsk with over 90 clubs across main directions, 80 of which are FREE
- **Facilities**: 15 modern laboratories with high-tech equipment
- **IT Center**: For intellectual development of children and youth

## Key Features
1. **AI Chat Assistant** - Full conversational AI chat focused on Digitalurpaq topics (NEW!)
2. **Animated Assistant Character** - Friendly mascot with idle animations and motivational speech bubbles
3. **Multi-Language Support** - Full internationalization in English, Kazakh, and Russian
4. **AI-Powered Interest Quiz** - Uses Gemini AI to generate personalized club recommendations
5. **Club Discovery** - Browse and search clubs by category with detailed information
6. **Registration System** - Register for clubs with scheduling and conflict detection
7. **Interactive Schedule** - Calendar view with 30-minute advance reminders
8. **Google Maps Integration** - Virtual tours and directions to the facility (updated to new location)
9. **Responsive Design** - Works on desktop, tablet, and mobile devices

## Main Directions

### 1. IT - ИНФОРМАЦИОННЫЕ ТЕХНОЛОГИИ
- Programming of control and measurement systems
- 3D prototyping and modeling
- LEGO construction and robotics
- Mechatronics
- SDR Radio
- Drone assembly and programming
- Web development and design

### 2. НАУЧНО-БИОЛОГИЧЕСКОЕ НАПРАВЛЕНИЕ
- Biotechnology
- Hydroponics ("Green Business")
- Ecology
- Scientific research activities

### 3. ХУДОЖЕСТВЕННО-ЭСТЕТИЧЕСКОЕ
- Art school
- Fine arts
- Decorative and applied arts
- Choreography

### 4. ЖУРНАЛИСТИКА И МЕДИАТЕХНОЛОГИИ
- Media journalism
- Video production
- Photography
- Blogging

### 5. БИЗНЕС ШКОЛА
- Entrepreneurship basics
- Financial literacy
- Business project design

### 6. ДЕБАТНЫЙ КЛУБ И КВН
- Public speaking mastery
- Art of debates
- KVN and humor

### 7. РАЗВЛЕКАТЕЛЬНЫЙ ЦЕНТР
- Game zones for younger students
- Interactive lessons

## Tech Stack
- **Frontend**: Preact (through React compat layer) + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL via Neon (Drizzle ORM)
- **AI Integration**: Google Gemini API (gemini-2.5-pro, gemini-2.5-flash)
- **Data Storage**: PostgreSQL with Drizzle ORM (production-ready)
- **Internationalization**: i18next
- **State Management**: TanStack Query (React Query v5)

## Design System
- **Theme**: Modern gradient background (sky blue to warm apricot) with vibrant accent colors
- **Primary Colors**: Light blue (#42A5F5), Coral (#FF7961), Lime (#9CCC65), Violet (#BA68C8)
- **Style**: Glassmorphism effects with gradient backgrounds, smooth animations, and depth
- **Components**: shadcn/ui with enhanced styling, custom badges, and hover effects
- **Effects**: Card hover animations, floating animations, fade-in transitions, glassmorphism headers
- **Icons**: Lucide React with animated elements
- **Badges**: Color-coded badges (success/info/warning) with rounded pill shapes
- **Progress Indicators**: Visual enrollment progress bars on club cards

## Architecture

### Frontend Structure
```
client/src/
├── components/          # Reusable UI components
│   ├── AssistantCharacter.tsx
│   ├── QuizInterface.tsx
│   ├── ClubCard.tsx
│   ├── RegistrationForm.tsx
│   ├── GoogleMapsEmbed.tsx
│   ├── MenuNavigation.tsx
│   ├── Header.tsx
│   ├── LanguageSwitcher.tsx
│   └── ui/             # shadcn components
├── pages/              # Route pages
│   ├── Home.tsx
│   ├── Clubs.tsx
│   ├── ClubDetails.tsx
│   ├── Quiz.tsx
│   ├── Schedule.tsx
│   ├── Rules.tsx
│   ├── Behavior.tsx
│   ├── Contacts.tsx
│   └── Settings.tsx
├── lib/
│   ├── i18n.ts         # Internationalization configuration
│   └── queryClient.ts  # TanStack Query setup
└── App.tsx             # Main app with routing
```

### Backend Structure
```
server/
├── index.ts            # Express server entry point
├── routes.ts           # API endpoints
├── gemini.ts           # Gemini AI integration
├── storage.ts          # In-memory data storage
└── vite.ts            # Vite integration
```

### Shared
```
shared/
└── schema.ts           # TypeScript types and Zod schemas
```

## API Endpoints

### Clubs
- `GET /api/clubs` - Get all clubs
- `GET /api/clubs/:id` - Get club details

### Chat (NEW!)
- `POST /api/chat` - Chat with AI assistant about Digitalurpaq

### Quiz
- `POST /api/quiz/generate` - Generate AI quiz questions
- `POST /api/quiz/recommendations` - Get club recommendations based on interests

### Registration
- `POST /api/registrations` - Create new registration
- `GET /api/registrations` - Get all registrations

### Schedule
- `GET /api/schedule` - Get user's schedule with all active registrations

### Reminders
- `GET /api/reminders/pending` - Get pending reminders
- `POST /api/reminders/:id/sent` - Mark reminder as sent

## Environment Variables
- `GEMINI_API_KEY` - Google Gemini API key (required for AI quiz and chat features)
- `DATABASE_URL` - PostgreSQL connection string (configured and active)
- `NODE_ENV` - Environment (development/production)

## Setup Instructions
1. **Install Dependencies**: `npm install`
2. **Database Migration**: `npm run db:push` (already completed)
3. **Seed Database**: `tsx server/seed.ts` (already completed with 5 sample clubs)
4. **Start Development**: `npm run dev` (runs on port 5000)
5. **Build for Production**: `npm run build`
6. **Start Production**: `npm run start`

## Data Models

### Club
- id, name, nameKz, nameRu
- description, descriptionKz, descriptionRu
- category, ageGroup, skillLevel
- schedule (JSON), maxCapacity, currentEnrollment
- location, imageUrl

### Registration
- id, studentName, studentAge, parentContact
- clubId, registeredAt, status

### Quiz Response
- id, sessionId, interests (JSON), recommendations (JSON)
- createdAt

### Reminder
- id, registrationId, activityDate, reminderSent, message

## Internationalization
All UI text is fully translated into three languages:
- English (en)
- Kazakh (kz) - Қазақ тілі
- Russian (ru) - Русский (default for Petropavlovsk)

Translation keys are organized by feature/component in `client/src/lib/i18n.ts`.

## Development

### Running the Project
```bash
npm run dev
```
This starts both the Express backend (port 5000) and Vite frontend dev server.

### Database Setup (Optional)
The project currently uses in-memory storage. To enable PostgreSQL:
```bash
npm run db:push
```

### Available Clubs
The application includes actual clubs from Дворец школьников "Digital Urpaq":
- **IT & Technology**: Robotics & LEGO, 3D Prototyping, Programming & Web Dev, Mechatronics, Drone Assembly, SDR Radio
- **Science**: Biotechnology Lab, Hydroponics - Green Business, Ecology & Environmental Science
- **Arts**: Art School, Decorative & Applied Arts, Choreography
- **Media**: Media Journalism, Video Production, Photography, Blogging
- **Business**: Business School, Financial Literacy
- **Languages & Culture**: Debate Club, KVN Club
- **Entertainment**: Entertainment Center for younger students

## User Workflows

### 1. Discovering Clubs
1. User lands on home page with animated assistant
2. Can browse all clubs or take interest quiz
3. Search and filter clubs by category
4. View detailed club information

### 2. Taking Interest Quiz
1. Click "Take Quiz" on home page
2. AI generates personalized questions in user's language
3. Answer questions about interests and preferences
4. Receive club recommendations with match percentages
5. Register directly from recommendations

### 3. Registration
1. Select a club
2. Fill registration form (student info, parent contact)
3. Confirm registration
4. Automatically added to schedule

### 4. Managing Schedule
1. View calendar with all registered activities
2. Receive 30-minute advance reminders
3. See club details, location
4. Track enrollment status

## Security & Best Practices
- No API keys exposed in client code
- Input validation with Zod schemas
- Type-safe API with TypeScript
- Proper error handling and loading states
- Environment variables for sensitive data

## Recent Changes (October 2025)

### Latest Updates (29.10.2025)
- **NEW**: Real-time clock with date and time in header (top-right corner)
  - Live updating seconds, HH:MM:SS format
  - Date in DD.MM.YYYY format
  - Glassmorphism design with clock icon
  - Responsive (hidden on mobile, visible on desktop)
- **NEW**: Docker support for server deployment
  - Optimized multi-stage Dockerfile
  - docker-compose.yml with PostgreSQL
  - Complete DOCKER_DEPLOY.md deployment guide
  - Ready for VPS/cloud deployment

### Character & Animation Updates
- **NEW**: Animated human character with 10+ animation states:
  - Continuous floating motion
  - Automatic eye blinking
  - Hair wave animation
  - Breathing animation (chest movement)
  - Arm waving when excited
  - Sparkles and special effects
  - Thought bubbles when thinking
  - Pulsing cheeks when happy/excited
  - Glowing book prop
  - Natural anatomy with shoulders, elbows, hands
- **IMPROVED**: More natural neck and arm anatomy
- **IMPROVED**: Character responds to clicks with different emotions

### UI & Design
- **NEW**: Animated gradient background (shifts smoothly)
- **NEW**: Gradient text with flowing animation
- **NEW**: Gradient buttons and message bubbles
- **NEW**: Text-to-speech with improved voice quality
- **NEW**: Voice input functionality for hands-free chat
- **NEW**: Glassmorphism effects on cards

### AI & Chat
- **FIXED**: AI no longer repeats greetings in every message
- **FIXED**: AI responses without emojis (cleaner, more professional)
- **IMPROVED**: TTS voice selection for better audio quality

### Production Deployment
- **NEW**: Configured for Replit Autoscale deployment
- **NEW**: Production build scripts (Vite + esbuild)
- **NEW**: DEPLOYMENT.md with full Replit deployment instructions
- **NEW**: DOCKER_DEPLOY.md for server/cloud deployment
- **READY**: Can be deployed with one click in Replit
- **READY**: Can be deployed to any Docker-compatible server

### Previous Updates
- Project adapted for Дворец школьников "Digital Urpaq" Petropavlovsk
- Full AI chat feature focused on Digital Urpaq topics
- Comprehensive facility information (15+ classrooms)
- Multi-language support (en, kz, ru)
- Location: V438+J5W, ул. Таштинова, Петропавловск 150000
- Contact: Приемная: +7 (7152) 34-02-40, Ресепшн: +7 (7152) 50-17-03
- All 7 main directions of education
- Over 20 actual clubs from Digital Urpaq programs

## Known Limitations
- Uses ReactDOM.render (React 17 API) through Preact compat - shows deprecation warning but works correctly
- In-memory storage - data resets on server restart (can be upgraded to PostgreSQL)
- Sample club data - needs to be populated with actual Petropavlovsk programs

## Future Enhancements
- Migrate to persistent PostgreSQL database
- Populate real club data from Petropavlovsk Palace
- User authentication system
- Admin dashboard for club management
- Email/SMS notifications for reminders
- Photo gallery for clubs
- Student progress tracking
- Certificate generation
- Integration with official website https://digitalurpaq.edu.kz
- Virtual 3D tour integration

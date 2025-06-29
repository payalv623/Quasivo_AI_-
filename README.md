# Quasivo AI Challenge - AI-Powered Candidate Screening Platform

## 🎯 Overview

Quasivo AI Challenge is a comprehensive candidate screening platform that leverages artificial intelligence to streamline the hiring process. The application provides intelligent resume parsing, automated question generation, and AI-powered candidate evaluation.

## ✨ Key Features

- **🔐 User Authentication**: Secure registration and login system
- **📄 Smart Resume Parsing**: AI-enhanced PDF parsing with text extraction
- **🎤 Voice Input Support**: Speech-to-text functionality for answers
- **🤖 AI Question Generation**: Contextual questions based on resume and job description
- **📊 Intelligent Evaluation**: AI-powered scoring and feedback
- **💾 Session Management**: Persistent user sessions and evaluation history
- **📱 Responsive Design**: Modern UI with Tailwind CSS

## 🛠️ Tech Stack

### Frontend

- **React 19.1.0** - Modern React with latest features
- **Vite 7.0.0** - Fast build tool and development server
- **React Router DOM 7.6.3** - Client-side routing
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **Lucide React 0.525.0** - Beautiful icons
- **PDF.js 5.3.31** - PDF parsing and manipulation

### Backend

- **Node.js** - JavaScript runtime
- **Express.js 5.1.0** - Web application framework
- **Multer 2.0.1** - File upload handling
- **PDF-Parse 1.1.1** - PDF text extraction
- **CORS 2.8.5** - Cross-origin resource sharing

### AI Integration

- **Google Gemini API** - AI-powered question generation and evaluation
- **Speech Recognition API** - Browser-based voice input

## 📋 Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **Google Gemini API Key** (for AI functionality)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Quasivo_AI
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment variables
# Add your Gemini API key to a .env file (if needed)
use "VITE_GEMINI_API_KEY" as your key
```

Example: VITE_GEMINI_API_KEY = ********\*\*\*********

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd vite-project

# Install dependencies
npm install

# Create environment file
# Create .env file and add your Gemini API key:
# VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Start the Application

#### Start Backend Server

```bash
# From the backend directory
cd backend
npm start
# Server will run on http://localhost:5000
```

#### Start Frontend Development Server

```bash
# From the vite-project directory
cd vite-project
npm run dev
# Frontend will run on http://localhost:5173 (or next available port)
```

### 5. Access the Application

Open your browser and navigate to the frontend URL (typically `http://localhost:5173`)

## 📁 Project Structure

```
Quasivo_AI/
├── backend/                          # Backend server
│   ├── data/                         # Evaluation results storage
│   │   └── result-*.json            # Generated evaluation files
│   │
│   ├── node_modules/                 # Backend dependencies
│   │
│   ├── server.js                     # Express server configuration
│   │
│   └── package.json                  # Backend dependencies
│
├── vite-project/                     # Frontend application
│   ├── public/                       # Static assets
│   │
│   ├── src/                          # Source code
│   │   │   ├── api/                      # API integration
│   │   │   │   ├── gemini.js            # Gemini AI API calls
│   │   │   │   └── save.js              # Data saving utilities
│   │   │   │
│   │   │   ├── assets/                   # Images and static files
│   │   │   │   ├── KH_LOGO.png          # Application logo
│   │   │   │   ├── GIF_HUMAN1.gif       # Landing page animation
│   │   │   │   └── react.svg            # React logo
│   │   │   │
│   │   │   ├── components/               # React components
│   │   │   │   ├── Home.jsx             # Main dashboard
│   │   │   │   ├── Login.jsx            # User authentication
│   │   │   │   ├── Register.jsx         # User registration
│   │   │   │   ├── Evaluate.jsx         # Question answering interface
│   │   │   │   ├── Result.jsx           # Evaluation results display
│   │   │   │   ├── SmartInput.jsx       # PDF upload and voice input
│   │   │   │   ├── VoiceTextInput.jsx   # Voice input component
│   │   │   │   └── PrivateRoute.jsx     # Route protection
│   │   │   │
│   │   │   ├── context/                  # React context
│   │   │   │   └── AuthContext.jsx      # Authentication and session management
│   │   │   │
│   │   │   ├── utils/                    # Utility functions
│   │   │   │   └── storageUtils.js      # LocalStorage management
│   │   │   │
│   │   │   ├── App.jsx                   # Main application component
│   │   │   ├── App.css                   # Application styles
│   │   │   ├── index.css                 # Global styles
│   │   │   └── main.jsx                  # Application entry point
│   │   │
│   │   ├── package.json                  # Frontend dependencies
│   │   └── vite.config.js               # Vite configuration
│   │
│   ├── SESSION_MANAGEMENT_GUIDE.md       # Session management documentation
│   └── README.md                         # This file
```

## 💾 Data Storage

### Frontend Storage (localStorage)

- **User Authentication**: `currentUser`, `users`
- **Session Data**: `resume`, `jobDesc`, `answers`
- **Evaluation History**: `evaluation_${userId}` (user-specific)

### Backend Storage

- **Evaluation Results**: `backend/data/result-*.json`
- **File Format**: JSON with timestamp-based naming

### Data Flow

1. **User Input** → Frontend localStorage
2. **PDF Upload** → Backend processing → Frontend display
3. **AI Evaluation** → Backend storage → Frontend display
4. **Session Management** → Frontend localStorage persistence

## 🔧 Configuration

### Environment Variables

#### Frontend (.env in vite-project/)

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

#### Backend (.env in backend/)

```env
# Add any backend-specific environment variables
```

### API Endpoints

#### Backend (http://localhost:5000)

- `POST /extract-pdf` - PDF text extraction
- `POST /save` - Save evaluation results

#### Frontend (http://localhost:5173)

- `/welcome` - Landing page
- `/login` - User authentication
- `/register` - User registration
- `/home` - Main dashboard
- `/evaluate` - Question answering
- `/result` - Evaluation results

## 🎮 Usage Flow

### New User

1. **Register** → Create account
2. **Login** → Authenticate
3. **Home** → Input resume and job description
4. **Evaluate** → Answer AI-generated questions
5. **Result** → View evaluation scores

### Returning User

1. **Login** → Direct access to previous results
2. **Result** → View saved evaluation data

## 🔒 Security Features

- **Route Protection**: Private routes require authentication
- **Session Management**: Secure user session handling
- **Data Isolation**: User-specific data storage
- **Input Validation**: Form validation and sanitization

## 🚀 Deployment

### Frontend Build

```bash
cd vite-project
npm run build
```

### Backend Production

```bash
cd backend
npm start
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**

   - Vite will automatically find the next available port
   - Check console output for the correct URL

2. **API Key Issues**

   - Ensure `VITE_GEMINI_API_KEY` is set in frontend `.env`
   - Verify API key is valid and has proper permissions

3. **PDF Upload Issues**

   - Ensure backend server is running on port 5000
   - Check CORS configuration if needed

4. **Session Issues**
   - Clear browser localStorage if experiencing authentication problems
   - Check browser console for error messages

## 📝 Development

### Available Scripts

#### Frontend (vite-project/)

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

#### Backend (backend/)

```bash
npm start        # Start production server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

**Built with ❤️ using React, Node.js, and Google Gemini AI**

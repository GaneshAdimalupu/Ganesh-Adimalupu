# 📅 Portfolio Scheduler - Complete Setup Guide

This directory contains the Node.js backend for the scheduling feature of the portfolio website. It uses the Google Calendar API to create events and Nodemailer to send email confirmations.

## 🌟 Features

- **📅 Google Calendar Integration** - Automatic event creation with Google Meet links
- **📧 Professional Email System** - HTML confirmation emails for clients and admin notifications
- **💾 MongoDB Database** - Secure booking storage with conflict prevention
- **🎯 Real-time UI** - Loading states, error handling, and success confirmations
- **📱 Responsive Design** - Works seamlessly on desktop and mobile
- **⏰ Smart Reminders** - Multiple calendar reminders (1 day, 1 hour, 30 min, 10 min)
- **🔒 Secure Authentication** - OAuth2 integration with Google services
- **📊 Admin Dashboard** - Booking management and status monitoring

## Prerequisites

Before you begin, ensure you have the following:
* [Node.js](https://nodejs.org/) installed
* An active **Google Account** (e.g., Gmail)
* A free **MongoDB Atlas** account

## 🚀 Getting Started

### 1. Install Dependencies
Navigate into this directory and install the required npm packages.
```bash
cd api
npm install
```

### 2. Create Environment File

Create a new file named `.env` in the `api` directory. Then, copy the contents of the `.env.example` file below into it.

#### `.env.example`

```env
# Server Configuration
PORT=5000

# MongoDB Configuration
MONGO_URI=

# Nodemailer (Gmail) Configuration
EMAIL_USER=
EMAIL_PASS=

# Google Calendar API Configuration
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
GOOGLE_REDIRECT_URI=https://developers.google.com/oauthplayground
CALENDAR_ID=primary
```

### 3. Obtain Credentials

Follow the steps below to get the required credentials and populate your `.env` file.

## 📋 Table of Contents

1. [Installation](#installation)
2. [Environment Setup](#environment-setup)
3. [Google Calendar Credentials](#google-calendar-credentials)
4. [Gmail Credentials](#gmail-credentials)
5. [MongoDB Setup](#mongodb-setup)
6. [Configuration](#configuration)
7. [Running the Application](#running-the-application)
8. [API Documentation](#api-documentation)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

## 💻 Installation

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud)
- **Google Account** (for Calendar and Gmail)

### Clone Repository

```bash
git clone https://github.com/yourusername/schedule-meeting-system.git
cd schedule-meeting-system
```

### Install Dependencies

```bash
# Install backend dependencies
cd api
npm install

# Install frontend dependencies
cd ..
npm install
```

## 🔧 Environment Setup

Create a `.env` file in the `/api` directory with the following variables:

```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/booking-system
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/booking-system

# Google Calendar API
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
CALENDAR_ID=primary

# Gmail SMTP
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Server Configuration
PORT=5000
NODE_ENV=development
```

-----

## 🔑 Credential Instructions

### 1. MongoDB URI (`MONGO_URI`)

This is the connection string for your database.

1. Go to **[MongoDB Atlas](https://cloud.mongodb.com/)** and log in.
2. Create a new project and build a free `M0` cluster.
3. Once the cluster is deployed, click **Connect**.
4. Follow the on-screen steps to create a database user (copy the password!) and add your current IP address to the access list.
5. Finally, select **"Drivers"** as the connection method.
6. Copy the provided **Connection String (URI)**.
7. Paste it into the `MONGO_URI` field in your `.env` file, replacing `<password>` with the actual password you created.

**Example:**
```env
MONGO_URI=mongodb+srv://username:password@cluster0.abcde.mongodb.net/booking-system?retryWrites=true&w=majority
```

### 2. Gmail App Password (`EMAIL_USER` & `EMAIL_PASS`)

This allows the backend to send emails using your Gmail account.

1. **Enable 2-Step Verification** on your Google Account here: **[Google Account Security](https://myaccount.google.com/security)**. You cannot generate an App Password without this.
2. Go to **[App Passwords](https://myaccount.google.com/apppasswords)**.
3. For "Select app," choose **"Mail"**.
4. For "Select device," choose **"Other (Custom name)".
5. Name it something like `Portfolio Scheduler` and click **Generate**.
6. Copy the **16-character password** that appears. This is your `EMAIL_PASS`.
7. Your `EMAIL_USER` is simply your full Gmail address.

**Example:**
```env
EMAIL_USER=ganesh.adimalupu@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

### 3. Google API Credentials (`GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`)

This authorizes your application to interact with Google APIs.

1. Go to the **[Google Cloud Console](https://console.cloud.google.com/)**.
2. Create a new project (e.g., "Portfolio-Scheduler-API").
3. Go to **Library**, search for **"Google Calendar API"**, and **Enable** it.
4. Go to **APIs & Services > OAuth consent screen**.
   * **User Type**: Select **External**.
   * **App Information**: Fill in an **App name** (e.g., "Scheduler"), your **User support email**, and your **Developer contact information**.
   * **Scopes & Test Users**: Click through the rest of the steps. On the "Test users" page, click **+ ADD USERS** and add your own Google email address. Save your changes.
5. Go to **APIs & Services > Credentials**.
   * Click **+ CREATE CREDENTIALS** > **OAuth client ID**.
   * **Application type**: Select **Web application**.
   * **Authorized redirect URIs**: Click **+ ADD URI** and paste in `https://developers.google.com/oauthplayground`.
   * Click **Create**. A pop-up will appear with your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

**Example:**
```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-AbCdEfGhIjKlMnOpQrStUvWxYz
```

### 4. Google Refresh Token (`GOOGLE_REFRESH_TOKEN`)

This allows your server to access the API on your behalf without you needing to log in repeatedly.

1. Go to the **[Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground)**.
2. In the top-right gear icon ⚙️, check **"Use your own OAuth credentials"** and paste in your Client ID and Secret.
3. On the left (Step 1), find and select the **Google Calendar API v3** > **`https://www.googleapis.com/auth/calendar`**.
4. Click the blue **Authorize APIs** button and sign in with the Google account you added as a test user.
5. Click the **"Exchange authorization code for tokens"** button.
6. Copy the **Refresh token** that appears on the right. This is your `GOOGLE_REFRESH_TOKEN`.

**Example:**
```env
GOOGLE_REFRESH_TOKEN=1//0abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuvwxyz
```

-----

## 🏃‍♂️ Run the Server

Once your `.env` file is complete, start the server.

```bash
node server.js
```

If successful, you will see the following output:

```
🚀 ENHANCED SERVER STARTED
📍 Server: http://localhost:5000
🏥 Health: http://localhost:5000/health
📅 Booking: POST http://localhost:5000/api/schedule/book
📋 Admin: GET http://localhost:5000/api/schedule/bookings
✨ Features: Google Calendar + Email + Enhanced Error Handling
✅ MongoDB connected
📊 Database: booking-system
```

Your backend is now ready.

## ⚙️ Configuration

### Frontend Configuration

In your React app, ensure the API URL matches your backend:

```javascript
// src/components/schedule/schedule.js
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-backend-domain.com'
  : 'http://localhost:5000';
```

### Backend Configuration

Update `api/server.js` CORS settings for production:

```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-frontend-domain.com']
    : ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true
};
```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start Backend**
   ```bash
   cd api
   npm start
   # OR
   node server.js
   ```

2. **Start Frontend** (in another terminal)
   ```bash
   npm start
   ```

3. **Access Application**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

### Production Mode

1. **Build Frontend**
   ```bash
   npm run build
   ```

2. **Start Backend**
   ```bash
   cd api
   NODE_ENV=production node server.js
   ```

## 📡 API Documentation

### Endpoints

#### Health Check
```http
GET /health
```
Response:
```json
{
  "status": "OK",
  "features": ["Database", "Google Calendar", "Email Notifications"],
  "timestamp": "2025-01-30T12:00:00.000Z"
}
```

#### Get Availability
```http
GET /api/schedule/availability?date=2025-01-30
```
Response:
```json
["10:00 AM", "02:00 PM"]
```

#### Create Booking
```http
POST /api/schedule/book
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-0123",
  "company": "Tech Corp",
  "message": "Discuss AI project",
  "meetingType": "consultation",
  "date": "2025-01-30",
  "time": "10:00 AM",
  "timezone": "UTC-05:00"
}
```

Response:
```json
{
  "success": true,
  "message": "Meeting scheduled successfully!",
  "booking": {
    "id": "65b8f1234567890abcdef123",
    "name": "John Doe",
    "date": "2025-01-30",
    "time": "10:00 AM"
  },
  "services": {
    "database": { "status": "success" },
    "calendar": { "status": "success", "eventId": "abc123" },
    "email": { "status": "success" }
  }
}
```

#### Get All Bookings (Admin)
```http
GET /api/schedule/bookings?limit=10&date=2025-01-30
```

#### Cancel Booking (Admin)
```http
DELETE /api/schedule/booking/:id
```

## 🚀 Deployment

### Backend Deployment (Heroku Example)

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   cd api
   heroku create your-app-name-api
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set MONGO_URI="your_mongodb_atlas_uri"
   heroku config:set GOOGLE_CLIENT_ID="your_client_id"
   heroku config:set GOOGLE_CLIENT_SECRET="your_client_secret"
   heroku config:set GOOGLE_REFRESH_TOKEN="your_refresh_token"
   heroku config:set CALENDAR_ID="primary"
   heroku config:set EMAIL_USER="your-email@gmail.com"
   heroku config:set EMAIL_PASS="your_app_password"
   ```

4. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### Frontend Deployment (Netlify Example)

1. **Build React App**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Visit: https://netlify.com
   - Drag and drop your `build` folder
   - Or connect your GitHub repository

3. **Environment Variables**
   - Set `REACT_APP_API_URL=https://your-backend-app.herokuapp.com`

## 🔧 Troubleshooting

### Common Issues

#### 1. Google Calendar "Authentication Failed"
**Problem**: Invalid credentials or expired tokens
**Solution**:
- Verify all Google credentials in `.env`
- Regenerate refresh token using the script above
- Check OAuth consent screen configuration

#### 2. Email "SMTP Authentication Failed"
**Problem**: Invalid Gmail app password
**Solution**:
- Ensure 2FA is enabled on Gmail
- Generate new app password
- Use app password, not regular Gmail password

#### 3. Database Connection Failed
**Problem**: MongoDB not accessible
**Solution**:
- For local: Ensure MongoDB service is running
- For Atlas: Check network access and user permissions
- Verify connection string format

#### 4. CORS Errors
**Problem**: Frontend can't access backend
**Solution**:
- Check CORS configuration in server.js
- Ensure frontend URL is in allowed origins
- Verify no typos in URLs

#### 5. "Time slot already booked"
**Problem**: Double booking attempt
**Solution**:
- This is expected behavior (conflict prevention)
- Choose a different time slot
- Check availability endpoint

### Debug Mode

Enable detailed logging by setting:
```env
DEBUG=true
NODE_ENV=development
```

### Health Checks

Test each component:

1. **Database**: `GET /health`
2. **Google Calendar**: Try creating a test event
3. **Email**: Check email service logs
4. **Frontend**: Check browser console for errors

## 📞 Support

### Getting Help

1. **Check logs** in browser console and server terminal
2. **Verify environment variables** are correctly set
3. **Test individual components** using health endpoints
4. **Check Google Cloud Console** for API quotas and errors

### Common Commands

```bash
# Check MongoDB connection
mongo --eval "db.adminCommand('ismaster')"

# Test email configuration
node -e "console.log(process.env.EMAIL_PASS)"

# Verify Google credentials
curl http://localhost:5000/health
```

## 📝 License

MIT License - feel free to use this project for your portfolio or commercial applications.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📸 Screenshots

### Desktop View
![Desktop Schedule Interface](screenshots/desktop-schedule.png)

### Mobile View
![Mobile Schedule Interface](screenshots/mobile-schedule.png)

### Email Confirmation
![Email Confirmation](screenshots/email-confirmation.png)

### Google Calendar Event
![Google Calendar Event](screenshots/calendar-event.png)

---

**Built with ❤️ by [Your Name]**

*Professional meeting booking system with enterprise-grade features*

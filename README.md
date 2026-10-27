# Eventify — Event Booking Web App

Eventify is a full-stack event booking web application built with the MERN stack, featuring user authentication, role-based access control, event management, and an interactive admin dashboard.

## 🚀 Features

- **User Authentication & Authorization**: Secure registration and login utilizing JWT (JSON Web Tokens) and bcrypt password hashing.
- **OTP Verification**: Email-based OTP verification system for enhanced user account security.
- **Admin Panel**: Dedicated dashboard for administrators to manage events, track bookings, and oversee platform users.
- **Event Management**: Browse, search, and view detailed event information with dynamic filtering.
- **RESTful API Backend**: Scalable Node.js and Express backend with MongoDB database integration using Mongoose.
- **Frontend Integration**: React-based client architecture configured with Axios for seamless API communication.

---

## 🛠️ Tech Stack

### **Frontend**
- **React.js**
- **React Router**
- **Axios** (for HTTP requests)
- **Context API** (for global state management)

### **Backend**
- **Node.js**
- **Express.js**
- **MongoDB & Mongoose**
- **JSON Web Tokens (JWT)**
- **Bcrypt.js**

---

## 📂 Project Structure

```text
EVENTIFY/
├── Frontend/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components (Navbar, etc.)
│   │   ├── context/        # Auth and app state context
│   │   ├── pages/          # Views (Home, Login, Register, AdminDashboard, etc.)
│   │   ├── utils/          # API configuration and helper files
│   │   └── App.js
│   └── package.json
│
└── Backend/                # Node.js & Express Backend
    ├── models/             # Mongoose schemas (User, Event, Booking)
    ├── routes/             # API route handlers
    ├── controllers/        # API controllers  
    ├── middleware/         # Auth and validation middleware
    ├── utils/              # Nodemails
    └── index.js           # Entry point


## Getting Started

### Prerequisites

Install the following before running the application:

- Node.js and npm
- MongoDB (local installation )
- Git

### 2. Install frontend dependencies

```bash
cd Frontend
npm install
```

### 3. Configure environment variables

Create a `.env` file in the backend directory and add the variables your backend expects. Example names:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
EMAIL_USER = abc@gmail.com
EMAIL_PASS = 16Digits
```

### 4. Start the backend

From the backend directory :

```bash
npm install
npm run dev
```

### 5. Start the frontend

Open a separate terminal:

```bash
cd Frontend                 # Because not completed
npm run dev
```

📌 Project Status
Active Hackathon Development / Work in Progress. The core backend architecture, authentication pipelines, database models, and initial frontend integration modules are established.

## Future Improvements

Potential improvements, depending on your project scope:

- Event categories and filters
- Booking history and ticket management
- Email confirmations and reminders
- QR-code tickets and check-in
- Improved mobile responsiveness
- Automated tests and deployment

## Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push the branch and open a pull request.

👨‍💻 Author
Abdullah Saleem

GitHub: @hasc444

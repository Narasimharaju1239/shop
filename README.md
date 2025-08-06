# Sri Santhoshimatha Aqua Bazar - MERN Stack Application

A complete e-commerce platform for water supply business with customer and owner management.

## Features

- **Customer Features:**
  - User registration and authentication
  - Browse products by company
  - Shopping cart functionality
  - Order placement with payment integration
  - Order history and tracking
  - Profile management

- **Owner Features:**
  - Product management (Add, Edit, Delete)
  - Company management
  - Order management with day-wise grouping
  - Customer management
  - Email notifications for orders

- **Admin Features:**
  - User role management
  - System monitoring
  - Database utilities

## Tech Stack

- **Frontend:** React.js, Context API, CSS3
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Tokens)
- **Email Service:** Nodemailer with Gmail
- **Payment Gateway:** PayU (configurable for multiple gateways)
- **File Upload:** Multer

## Deployment

### Backend (Render)
1. Create account at [render.com](https://render.com)
2. Connect GitHub repository
3. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Set environment variables from `.env.example`

### Frontend (Netlify)
1. Create account at [netlify.com](https://netlify.com)
2. Connect GitHub repository
3. Configure:
   - **Base Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `build`

## Environment Variables

Copy `.env.example` to `.env` and fill in your actual values:

### Required Variables:
- `MONGO_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret for JWT token generation
- `EMAIL_USER` - Gmail address for sending emails
- `EMAIL_PASS` - Gmail app password
- `BASE_URL` - Your backend deployment URL
- `FRONTEND_URL` - Your frontend deployment URL

### Optional Variables:
- SMS service credentials (MSG91, Twilio, etc.)
- Payment gateway credentials (PayU, Razorpay, etc.)

## Local Development

1. Clone the repository
2. Install backend dependencies: `cd backend && npm install`
3. Install frontend dependencies: `cd frontend && npm install`
4. Set up `.env` file in backend directory
5. Start backend: `cd backend && npm start`
6. Start frontend: `cd frontend && npm start`

## Database Setup

The application uses MongoDB Atlas. Create a cluster and get the connection string to use in `MONGO_URI`.

## Email Configuration

Configure Gmail with app password:
1. Enable 2-factor authentication
2. Generate app password
3. Use the app password in `EMAIL_PASS`

## Payment Gateway

Currently configured for PayU with demo credentials. Replace with production credentials for live usage.

## License

MIT License

# Payment Billing System - Backend

Backend API for the Payment Billing System built with Node.js, Express, and MongoDB.

## Features

- User registration with OTP verification
- SMS OTP sending via Twilio
- Payment processing
- Business management
- User authentication

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory and add your Twilio credentials:

```env
# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/payment_billing_system

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Twilio Setup

1. **Create a Twilio Account**: Go to [twilio.com](https://www.twilio.com) and create an account
2. **Get your Account SID and Auth Token**:
   - Login to your Twilio dashboard
   - Copy your Account SID and Auth Token from the dashboard
3. **Get a Twilio Phone Number**:
   - In your Twilio dashboard, go to Phone Numbers > Manage
   - Buy a phone number or use a trial number
4. **Update .env file** with your credentials

### 4. Database Setup

Make sure MongoDB is running on your system. The default connection is `mongodb://localhost:27017/payment_billing_system`.

### 5. Run the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on port 5000 (or the port specified in your .env file).

## API Endpoints

### User Management
- `POST /api/users/send-otp` - Send OTP to mobile number
- `POST /api/users/verify-otp-and-register` - Verify OTP and register user
- `POST /login` - User login
- `POST /register` - Legacy registration (without OTP)
- `GET /user/:mobile` - Get user by mobile number

### Payments
- `POST /make-payment` - Process payment
- `GET /payments/:mobile` - Get user payments

### Business Management
- `POST /seed-demo-data` - Seed demo business data
- `GET /businesses` - Get all businesses
- `GET /business/:id` - Get business by ID

### Other
- `GET /test-connection` - Test API connection
- `POST /forgot` - Password reset
- `POST /otp` - Legacy OTP generation

## SMS OTP Flow

1. User enters mobile number and email during registration
2. System generates 6-digit OTP and stores it temporarily
3. OTP is sent via SMS using Twilio
4. User enters OTP for verification
5. If OTP is correct and not expired, user account is created

## Development Notes

- OTPs expire after 5 minutes
- In development mode, OTP is also returned in the API response for testing
- Make sure to remove `testOtp` from production responses
- SMS sending requires valid Twilio credentials

## Troubleshooting

### SMS Not Sending
- Check your Twilio account balance
- Verify phone number format (include country code)
- Check Twilio logs in your dashboard
- Ensure your phone number is verified (trial accounts)

### Database Connection Issues
- Make sure MongoDB is running
- Check the MONGODB_URI in your .env file
- Verify network connectivity

## Testing

### Test OTP Functionality

```bash
# Install test dependencies
npm install

# Start the server in one terminal
npm start

# Run OTP tests in another terminal
node test-otp.js
```

This will test the complete OTP flow including SMS sending (if Twilio is configured).
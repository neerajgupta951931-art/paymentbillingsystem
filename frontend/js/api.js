// Shared API configuration and utilities
const API_BASE_URL = 'http://localhost:5000';

// Generic API call function
async function apiCall(endpoint, options = {}) {
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const config = { ...defaultOptions, ...options };
    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();
        return { response, data };
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// User authentication functions
async function loginUser(mobile, password) {
    const { response, data } = await apiCall('/login', {
        method: 'POST',
        body: { mobile, password }
    });
    return response.ok ? data : null;
}

async function registerUser(userData) {
    const { response, data } = await apiCall('/register', {
        method: 'POST',
        body: userData
    });
    return response.ok ? data : null;
}

async function sendOTP(mobile, email) {
    const { response, data } = await apiCall('/api/users/send-otp', {
        method: 'POST',
        body: { mobile, email }
    });
    return response.ok ? data : null;
}

async function verifyOTPAndRegister(otpData) {
    const { response, data } = await apiCall('/api/users/verify-otp-and-register', {
        method: 'POST',
        body: otpData
    });
    return response.ok ? data : null;
}

// User data functions
async function getUserData(mobile) {
    const { response, data } = await apiCall(`/user/${mobile}`);
    return response.ok ? data : null;
}

async function getUserPayments(mobile) {
    const { response, data } = await apiCall(`/payments/${mobile}`);
    return response.ok ? data : null;
}

// Business functions
async function getBusinesses() {
    const { response, data } = await apiCall('/businesses');
    return response.ok ? data : null;
}

async function getBusinessById(id) {
    const { response, data } = await apiCall(`/business/${id}`);
    return response.ok ? data : null;
}

// Payment functions
async function makePayment(paymentData) {
    const { response, data } = await apiCall('/make-payment', {
        method: 'POST',
        body: paymentData
    });
    return response.ok ? data : null;
}

// Export functions for use in other files
window.API = {
    apiCall,
    loginUser,
    registerUser,
    sendOTP,
    verifyOTPAndRegister,
    getUserData,
    getUserPayments,
    getBusinesses,
    getBusinessById,
    makePayment
};
app.post("/pay", async (req, res) => {

    const { sender, receiver, amount } = req.body;

    const senderUser = await User.findOne({ mobile: sender });

    if (!senderUser || senderUser.balance < amount) {
        return res.send("Insufficient Balance ❌");
    }

    const receiverUser = await User.findOne({ mobile: receiver });

    if (!receiverUser) {
        return res.send("Receiver not found ❌");
    }

    // Deduct & Add
    senderUser.balance -= amount;
    receiverUser.balance += amount;

    await senderUser.save();
    await receiverUser.save();

    await Payment.create({ sender, receiver, amount });

    res.send("Payment Successful ✅");
});
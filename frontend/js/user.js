// ==========================
// USER MANAGER (SECURE VERSION)
// ==========================

let currentUser = null;
let token = null;

// LOAD DATA
function loadUserData() {
    try {
        const savedUser = localStorage.getItem('currentUser');
        const savedToken = localStorage.getItem('token');

        if (savedUser && savedToken) {
            currentUser = JSON.parse(savedUser);
            token = savedToken;
            updateUserDisplay();
        }
    } catch (err) {
        console.error("Load error:", err);
        logout();
    }
}

// SAVE DATA
function saveUserData(user, userToken) {
    currentUser = user;
    token = userToken;

    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', userToken);

    updateUserDisplay();
}

// LOGOUT
function logout() {
    currentUser = null;
    token = null;

    localStorage.clear();

    window.location = "login.html";
}

// UI UPDATE
function updateUserDisplay() {
    if (!currentUser) return;

    // Text fields
    document.querySelectorAll('[data-user-field]')
        .forEach(el => {
            const field = el.dataset.userField;
            el.textContent = currentUser[field] || '';
        });

    // Balance
    document.querySelectorAll('[data-user-balance]')
        .forEach(el => {
            el.textContent = `₹${(currentUser.balance || 0).toFixed(2)}`;
        });
}

// LOGIN CHECK
function isLoggedIn() {
    return !!token;
}

// GET TOKEN
function getToken() {
    return token;
}

// FETCH WITH AUTH (IMPORTANT)
async function authFetch(url, options = {}) {
    if (!token) {
        logout();
        return;
    }

    const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    };

    const res = await fetch(url, {
        ...options,
        headers
    });

    // अगर token expire हो जाए
    if (res.status === 401) {
        logout();
    }

    return res;
}

// REFRESH USER FROM SERVER
async function refreshUser() {
    try {
        const res = await authFetch("http://localhost:5000/profile");

        if (res.ok) {
            const user = await res.json();
            saveUserData(user, token);
        }
    } catch (err) {
        console.error("Refresh error:", err);
    }
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
});

// EXPORT
window.UserManager = {
    loadUserData,
    saveUserData,
    logout,
    isLoggedIn,
    getToken,
    authFetch,
    refreshUser
}; app.delete("/admin/user/:id", async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.send("User deleted");
});
// ===============================
// CONFIG
// ===============================
const API_BASE_URL = "http://localhost:5000";

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

function initApp() {
    testBackendConnection();
    initForms();

    if (window.UserManager) {
        UserManager.loadUserData();

        if (UserManager.isLoggedIn()) {
            const page = window.location.pathname.split("/").pop();

            if (["login.html", "index.html", ""].includes(page)) {
                window.location.href = "dashboard.html";
            } else {
                loadUserBalance();
            }
        }
    }
}

// ===============================
// COMMON API FUNCTION
// ===============================
async function apiCall(endpoint, options = {}) {
    try {
        const res = await fetch(API_BASE_URL + endpoint, {
            headers: {
                "Content-Type": "application/json",
                ...(window.UserManager?.getToken() && {
                    "Authorization": "Bearer " + UserManager.getToken()
                })
            },
            ...options
        });

        if (res.status === 401) {
            UserManager.logout();
            return null;
        }

        return await res.json();
    } catch (err) {
        console.error("API Error:", err);
        return null;
    }
}

// ===============================
// FORM INIT
// ===============================
function initForms() {
    bindForm("loginForm", handleLogin);
    bindForm("registerForm", handleRegister);
    bindForm("paymentForm", handlePayment);
}

function bindForm(id, handler) {
    const form = document.getElementById(id);
    if (form) form.addEventListener("submit", handler);
}

// ===============================
// LOGIN
// ===============================
async function handleLogin(e) {
    e.preventDefault();

    const mobile = loginMobile.value;
    const password = loginPassword.value;

    const res = await apiCall("/login", {
        method: "POST",
        body: JSON.stringify({ mobile, password })
    });

    if (res && res.token) {
        UserManager.saveUserData(res.user, res.token);
        window.location = "dashboard.html";
    } else {
        showToast("Invalid login", "error");
    }
}

// ===============================
// REGISTER
// ===============================
async function handleRegister(e) {
    e.preventDefault();

    const data = {
        name: regName.value,
        mobile: regMobile.value,
        password: regPassword.value
    };

    const res = await apiCall("/register", {
        method: "POST",
        body: JSON.stringify(data)
    });

    if (res && res.success) {
        showToast("Registered successfully", "success");
        window.location = "login.html";
    } else {
        showToast("Registration failed", "error");
    }
}

// ===============================
// LOAD BALANCE
// ===============================
async function loadUserBalance() {
    const res = await apiCall("/profile");

    if (res) {
        UserManager.saveUserData(res, UserManager.getToken());
    }
}

// ===============================
// PAYMENT
// ===============================
async function handlePayment(e) {
    e.preventDefault();

    if (!UserManager.isLoggedIn()) {
        showToast("Login required", "error");
        return;
    }

    const data = {
        amount: parseFloat(paymentAmount.value),
        to: paymentTo.value
    };

    const res = await apiCall("/pay", {
        method: "POST",
        body: JSON.stringify(data)
    });

    if (res && res.success) {
        // ✅ Save receipt
        localStorage.setItem("receipt", JSON.stringify(res.receipt));

        showToast("Payment Successful", "success");

        setTimeout(() => {
            window.location = "receipt.html";
        }, 1000);

    } else {
        showToast("Payment failed", "error");
    }
}

// ===============================
// TRANSACTIONS
// ===============================
async function loadTransactions() {
    const res = await apiCall("/transactions");

    if (!res) return;

    const container = document.getElementById("transactionsList");

    container.innerHTML = res.map(tx => `
        <div class="transaction-item">
            <p><b>₹${tx.amount}</b> → ${tx.to}</p>
            <small>${new Date(tx.date).toLocaleString()}</small>
        </div>
    `).join("");
}

// ===============================
// LOGOUT
// ===============================
function logout() {
    UserManager.logout();
}

// ===============================
// TOAST
// ===============================
function showToast(msg, type = "success") {
    const t = document.getElementById("toast");
    if (!t) return;

    t.textContent = msg;
    t.className = "toast " + type;
    t.classList.add("show");

    setTimeout(() => t.classList.remove("show"), 3000);
}

// ===============================
// BACKEND TEST
// ===============================
async function testBackendConnection() {
    const el = document.getElementById("connectionStatus");
    if (!el) return;

    try {
        await fetch(API_BASE_URL);
        el.textContent = "🟢 Connected";
    } catch {
        el.textContent = "🔴 Offline";
    }
}// ================= BANK LIST =================
const banks = [
    { name: "SBI", logo: "images/banks/sbi.png" },
    { name: "HDFC", logo: "images/banks/hdfc.png" },
    { name: "ICICI", logo: "images/banks/icici.png" },
    { name: "Axis Bank", logo: "images/banks/axis.png" },
    { name: "PNB", logo: "images/banks/pnb.png" },
    { name: "Kotak", logo: "images/banks/kotak.png" },
    { name: "HSBC", logo: "images/banks/hsbc.png" },
    { name: "Citibank", logo: "images/banks/citi.png" },
    { name: "Barclays", logo: "images/banks/barclays.png" }
];

// ================= LOAD BANK UI =================
function loadBanks() {
    const container = document.getElementById("bankGrid");
    if (!container) return;

    container.innerHTML = "";

    banks.forEach(bank => {
        const div = document.createElement("div");
        div.className = "bank-card";

        div.innerHTML = `
      <img src="${bank.logo}" alt="${bank.name}">
      <p>${bank.name}</p>
    `;

        div.onclick = () => selectBank(bank.name);

        container.appendChild(div);
    });
}

// ================= SELECT BANK =================
function selectBank(bankName) {
    document.querySelectorAll(".bank-card").forEach(card => {
        card.classList.remove("active");
    });

    const selected = [...document.querySelectorAll(".bank-card")]
        .find(card => card.innerText.includes(bankName));

    if (selected) selected.classList.add("active");

    document.getElementById("beneName").value = bankName;

    localStorage.setItem("selectedBank", bankName);
}

// ================= IFSC DETECT =================
async function detectBankFromIFSC() {
    const ifsc = document.getElementById("beneIFSC").value.trim();

    if (ifsc.length < 5) return;

    try {
        const res = await fetch(`https://ifsc.razorpay.com/${ifsc}`);
        if (!res.ok) throw new Error();

        const data = await res.json();
        const bankName = data.BANK;

        document.getElementById("beneName").value = bankName;

        // highlight bank
        banks.forEach(b => {
            if (bankName.toLowerCase().includes(b.name.toLowerCase())) {
                selectBank(b.name);
            }
        });

    } catch (err) {
        console.log("Invalid IFSC");
    }
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", loadBanks);

// Navigation utilities
function navigateTo(page) {
    window.location.href = page;
}

function goBack() {
    window.history.back();
}

function goToDashboard() {
    navigateTo('dashboard.html');
}

function goToLogin() {
    navigateTo('login.html');
}

function goToProfile() {
    navigateTo('profile.html');
}

function goToWallet() {
    navigateTo('wallet.html');
}

function goToPayment() {
    navigateTo('payment.html');
}

function goToBusiness() {
    navigateTo('business.html');
}

function goToScanPay() {
    navigateTo('scanpay.html');
}

function goToRecharge() {
    navigateTo('recharge.html');
}

function goToRewards() {
    navigateTo('rewards.html');
}

function goToBilling() {
    navigateTo('billing.html');
}

// Logout function
function logout() {
    if (window.UserManager) {
        window.UserManager.clearUserData();
    }
    goToLogin();
}

// Initialize navigation event listeners
function initNavigation() {
    // Add click handlers for navigation elements
    document.addEventListener('click', function(e) {
        const target = e.target.closest('[data-navigate]');
        if (target) {
            e.preventDefault();
            const page = target.getAttribute('data-navigate');
            navigateTo(page);
        }
    });
}

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', initNavigation);

// Export functions
window.Navigation = {
    navigateTo,
    goBack,
    goToDashboard,
    goToLogin,
    goToProfile,
    goToWallet,
    goToPayment,
    goToBusiness,
    goToScanPay,
    goToRecharge,
    goToRewards,
    goToBilling,
    logout,
    initNavigation
};
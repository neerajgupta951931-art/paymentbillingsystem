function shareWhatsApp() {
    const receipt = JSON.parse(localStorage.getItem("receipt"));

    const text = `
Payment Successful ✅
Amount: ₹${receipt.amount}
To: ${receipt.to}
Txn ID: ${receipt.id}
`;

    const url = "https://wa.me/?text=" + encodeURIComponent(text);
    window.open(url, "_blank");
}
app.post("/card-pay", async (req, res) => {
    const { cardNumber, amount } = req.body;

    if (cardNumber.length < 16) {
        return res.json({ success: false, message: "Invalid card" });
    }

    // simulate payment
    res.json({ success: true, message: "Card Payment Success" });
});
function printReceipt() {
    window.print();
}
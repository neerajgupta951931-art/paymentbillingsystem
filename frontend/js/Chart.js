function loadChart(users) {
    const totalUsers = users.length;
    const lowBalance = users.filter(u => u.balance < 100).length;
    const richUsers = users.filter(u => u.balance >= 100).length;

    const ctx = document.getElementById('userChart');

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Low Balance', 'Active Users'],
            datasets: [{
                data: [lowBalance, richUsers]
            }]
        }
    });
} app.get("/admin/transactions", async (req, res) => {
    const tx = await Wallet.find().sort({ createdAt: -1 });
    res.json(tx);
}); async function loadTransactions() {
    const res = await fetch(API + "/admin/transactions");
    const data = await res.json();

    const table = document.getElementById("txTable");
    table.innerHTML = "";

    data.forEach(t => {
        const row = `
      <tr>
        <td>${t.userId}</td>
        <td>${t.type}</td>
        <td>₹${t.amount}</td>
      </tr>
    `;
        table.innerHTML += row;
    });
}
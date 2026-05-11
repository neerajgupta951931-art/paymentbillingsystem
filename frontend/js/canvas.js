// Canvas drawing utilities
function createCanvasGradient(ctx, width, height, color1, color2) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
}

function drawProgressCircle(canvasId, progress, label = 'Complete') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background gradient
    const gradient = createCanvasGradient(ctx, 0, 0, canvas.width, canvas.height,
        'rgba(102, 126, 234, 0.05)', 'rgba(118, 75, 162, 0.05)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Background circle
    ctx.fillStyle = '#e9ecef';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Progress arc
    ctx.fillStyle = '#667eea';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + (progress / 100) * Math.PI * 2);
    ctx.lineTo(centerX, centerY);
    ctx.fill();

    // Progress text
    ctx.fillStyle = '#2d3436';
    ctx.font = 'bold 24px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(Math.round(progress) + '%', centerX, centerY + 5);

    // Label
    ctx.font = '12px Inter';
    ctx.fillStyle = '#666';
    ctx.fillText(label, centerX, centerY + 35);
}

function drawBarChart(canvasId, data, labels, colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c']) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);
    const barWidth = chartWidth / data.length - 10;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background
    const gradient = createCanvasGradient(ctx, 0, 0, width, height,
        'rgba(102, 126, 234, 0.05)', 'rgba(118, 75, 162, 0.05)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Find max value for scaling
    const maxValue = Math.max(...data);

    // Draw bars
    data.forEach((value, index) => {
        const barHeight = (value / maxValue) * chartHeight;
        const x = padding + (index * (chartWidth / data.length));
        const y = height - padding - barHeight;

        // Bar
        ctx.fillStyle = colors[index % colors.length];
        ctx.fillRect(x, y, barWidth, barHeight);

        // Value label on bar
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(value.toString(), x + barWidth / 2, y + barHeight / 2 + 5);

        // X-axis label
        ctx.fillStyle = '#666';
        ctx.font = '12px Inter';
        ctx.fillText(labels[index], x + barWidth / 2, height - 10);
    });
}

function drawLineChart(canvasId, data, labels, color = '#667eea') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background
    const gradient = createCanvasGradient(ctx, 0, 0, width, height,
        'rgba(102, 126, 234, 0.05)', 'rgba(118, 75, 162, 0.05)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Find max value for scaling
    const maxValue = Math.max(...data);

    // Draw line
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();

    data.forEach((value, index) => {
        const x = padding + (index * (chartWidth / (data.length - 1)));
        const y = height - padding - (value / maxValue) * chartHeight;

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }

        // Data point
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = '#666';
        ctx.font = '10px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(labels[index], x, height - 10);
        ctx.fillText(value.toString(), x, y - 10);
    });

    ctx.stroke();
}

function drawPieChart(canvasId, data, labels, colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4ecdc4']) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 40;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    const gradient = createCanvasGradient(ctx, 0, 0, canvas.width, canvas.height,
        'rgba(102, 126, 234, 0.05)', 'rgba(118, 75, 162, 0.05)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const total = data.reduce((sum, value) => sum + value, 0);
    let currentAngle = -Math.PI / 2;

    data.forEach((value, index) => {
        const sliceAngle = (value / total) * Math.PI * 2;

        // Draw slice
        ctx.fillStyle = colors[index % colors.length];
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();

        // Label
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius + 20);
        const labelY = centerY + Math.sin(labelAngle) * (radius + 20);

        ctx.fillStyle = '#666';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(labels[index], labelX, labelY);

        currentAngle += sliceAngle;
    });
}

// Export functions
window.CanvasUtils = {
    createCanvasGradient,
    drawProgressCircle,
    drawBarChart,
    drawLineChart,
    drawPieChart
};
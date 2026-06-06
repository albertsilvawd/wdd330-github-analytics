import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend, BarController } from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, BarController);

export default class ActivityChart {
    constructor(repos) {
        this.repos = repos || [];
    }

    getMonthlyData() {
        const months = {};
        const now = new Date();

        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            months[key] = 0;
        }

        this.repos.forEach(repo => {
            const updated = new Date(repo.updated_at);
            const key = updated.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            if (months[key] !== undefined) {
                months[key]++;
            }
        });

        return months;
    }

    render(container) {
        const data = this.getMonthlyData();
        const labels = Object.keys(data);
        const values = Object.values(data);

        if (values.every(v => v === 0)) return;

        const html = `
      <div class="section">
        <h3 class="section-title">Repository Activity (Last 12 Months)</h3>
        <div class="bar-chart-container">
          <canvas id="activity-chart"></canvas>
        </div>
      </div>
    `;
        container.insertAdjacentHTML('beforeend', html);

        const canvas = document.getElementById('activity-chart');
        new Chart(canvas, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Repos Updated',
                    data: values,
                    backgroundColor: 'rgba(163, 198, 57, 0.7)',
                    borderColor: '#a3c639',
                    borderWidth: 1,
                    borderRadius: 4,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ` ${ctx.raw} repo${ctx.raw !== 1 ? 's' : ''} updated`
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#8aab6a', font: { size: 11 } },
                        grid: { color: '#2a4a2a' }
                    },
                    y: {
                        ticks: { color: '#8aab6a', stepSize: 1 },
                        grid: { color: '#2a4a2a' },
                        beginAtZero: true
                    }
                }
            }
        });
    }
}
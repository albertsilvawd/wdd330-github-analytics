import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

export default class LanguagesChart {
    constructor(repos) {
        this.repos = repos || [];
    }

    getLanguageData() {
        const langs = {};
        this.repos.forEach(repo => {
            if (repo.language) {
                langs[repo.language] = (langs[repo.language] || 0) + 1;
            }
        });
        return Object.entries(langs)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6);
    }

    render(container) {
        const data = this.getLanguageData();
        if (data.length === 0) return;

        const colors = [
            '#a3c639', '#e8c547', '#6aab8a', '#5a9abf',
            '#bf7a5a', '#9a5abf'
        ];

        const html = `
      <div class="section">
        <h3 class="section-title">Languages Used</h3>
        <div class="chart-container">
          <canvas id="languages-chart"></canvas>
          <div class="chart-legend">
            ${data.map(([lang, count], i) => `
              <div class="legend-item">
                <span class="legend-color" style="background: ${colors[i % colors.length]}"></span>
                <span class="legend-label">${lang}</span>
                <span class="legend-count">${count} repo${count > 1 ? 's' : ''}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
        container.insertAdjacentHTML('beforeend', html);

        const canvas = document.getElementById('languages-chart');
        new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: data.map(([lang]) => lang),
                datasets: [{
                    data: data.map(([, count]) => count),
                    backgroundColor: colors.slice(0, data.length),
                    borderColor: '#1a2e1a',
                    borderWidth: 3,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ` ${ctx.label}: ${ctx.raw} repos`
                        }
                    }
                }
            }
        });
    }
}
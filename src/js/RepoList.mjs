export default class RepoList {
    constructor(repos) {
        this.repos = repos.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6);
    }

    render(container) {
        const html = `
      <div class="section">
        <h3 class="section-title">Top Repositories</h3>
        <ul class="repo-list">
          ${this.repos.map(repo => `
            <li class="repo-card">
              <div class="repo-header">
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                ${repo.fork ? '<span class="repo-badge">fork</span>' : ''}
              </div>
              <p class="repo-desc">${repo.description || 'No description'}</p>
              <div class="repo-stats">
                ${repo.language ? `<span>🔵 ${repo.language}</span>` : ''}
                <span>⭐ ${repo.stargazers_count}</span>
                <span>🍴 ${repo.forks_count}</span>
              </div>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
        container.insertAdjacentHTML('beforeend', html);
    }
}
export default class ProfileDashboard {
  constructor(data) {
    this.profile = data.profile;
    this.repos = data.repos || [];
  }

  getTotalStars() {
    return this.repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  }

  getTopLanguages() {
    const langs = {};
    this.repos.forEach(repo => {
      if (repo.language) {
        langs[repo.language] = (langs[repo.language] || 0) + 1;
      }
    });
    return Object.entries(langs)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([lang]) => lang);
  }

  render(container) {
    const profile = this.profile;
    const topLangs = this.getTopLanguages();

    const html = `
      <div class="profile-card">
        <img 
          src="${profile.avatar_url || '/src/assets/default-avatar.png'}" 
          alt="${profile.login}" 
          onerror="this.src='https://github.githubassets.com/images/gravatars/gravatar-user-420.png'"
        />
        <div class="profile-info">
          <h2>${profile.name || profile.login}</h2>
          <p>@${profile.login}</p>
          ${profile.bio ? `<p>${profile.bio}</p>` : ''}
          ${profile.location ? `<p>📍 ${profile.location}</p>` : ''}
          ${profile.blog ? `<p>🔗 <a href="${profile.blog.startsWith('http') ? profile.blog : 'https://' + profile.blog}" target="_blank">${profile.blog}</a></p>` : ''}
          ${profile.company ? `<p>🏢 ${profile.company}</p>` : ''}
          ${topLangs.length > 0 ? `
            <div class="top-langs">
              <span class="langs-label">Top languages:</span>
              ${topLangs.map(lang => `<span class="lang-badge">${lang}</span>`).join('')}
            </div>
          ` : ''}
          <div class="profile-stats">
            <div class="stat">
              <strong>${profile.public_repos || 0}</strong>
              <span>Repos</span>
            </div>
            <div class="stat">
              <strong>${profile.followers || 0}</strong>
              <span>Followers</span>
            </div>
            <div class="stat">
              <strong>${profile.following || 0}</strong>
              <span>Following</span>
            </div>
            <div class="stat">
              <strong>${this.getTotalStars()}</strong>
              <span>Stars</span>
            </div>
          </div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
  }
}
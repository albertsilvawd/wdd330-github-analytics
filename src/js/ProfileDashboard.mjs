export default class ProfileDashboard {
    constructor(data) {
        this.profile = data.profile;
        this.repos = data.repos;
    }

    renderProfile() {
        return `
      <div class="profile-card">
        <img src="${this.profile.avatar_url}" alt="${this.profile.login}" />
        <div class="profile-info">
          <h2>${this.profile.name || this.profile.login}</h2>
          <p>@${this.profile.login}</p>
          ${this.profile.bio ? `<p>${this.profile.bio}</p>` : ''}
          ${this.profile.location ? `<p>📍 ${this.profile.location}</p>` : ''}
          <div class="profile-stats">
            <div class="stat">
              <strong>${this.profile.public_repos}</strong>
              <span>Repos</span>
            </div>
            <div class="stat">
              <strong>${this.profile.followers}</strong>
              <span>Followers</span>
            </div>
            <div class="stat">
              <strong>${this.profile.following}</strong>
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
    }

    getTotalStars() {
        return this.repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    }

    render(container) {
        container.innerHTML = this.renderProfile();
    }
}
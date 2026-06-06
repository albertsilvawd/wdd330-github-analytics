export default class ProfileScore {
    constructor(profile, repos) {
        this.profile = profile;
        this.repos = repos || [];
    }

    calculate() {
        let score = 0;
        const breakdown = [];

        // Followers (max 25 points)
        const followerPoints = Math.min(25, Math.floor(this.profile.followers / 10));
        score += followerPoints;
        breakdown.push({ label: 'Followers', points: followerPoints, max: 25 });

        // Repositories (max 20 points)
        const repoPoints = Math.min(20, this.profile.public_repos * 2);
        score += repoPoints;
        breakdown.push({ label: 'Public Repos', points: repoPoints, max: 20 });

        // Stars received (max 25 points)
        const totalStars = this.repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        const starPoints = Math.min(25, Math.floor(totalStars / 5));
        score += starPoints;
        breakdown.push({ label: 'Stars Received', points: starPoints, max: 25 });

        // Profile completeness (max 20 points)
        let profilePoints = 0;
        if (this.profile.name) profilePoints += 5;
        if (this.profile.bio) profilePoints += 5;
        if (this.profile.location) profilePoints += 5;
        if (this.profile.blog) profilePoints += 5;
        score += profilePoints;
        breakdown.push({ label: 'Profile Complete', points: profilePoints, max: 20 });

        // Recent activity (max 10 points)
        const recentRepos = this.repos.filter(repo => {
            const updated = new Date(repo.updated_at);
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            return updated > sixMonthsAgo;
        });
        const activityPoints = Math.min(10, recentRepos.length * 2);
        score += activityPoints;
        breakdown.push({ label: 'Recent Activity', points: activityPoints, max: 10 });

        return { score: Math.min(100, score), breakdown };
    }

    getLabel(score) {
        if (score >= 80) return { label: 'Elite Developer', color: '#e8c547' };
        if (score >= 60) return { label: 'Active Developer', color: '#a3c639' };
        if (score >= 40) return { label: 'Growing Developer', color: '#6aab8a' };
        if (score >= 20) return { label: 'Junior Developer', color: '#8aab6a' };
        return { label: 'Getting Started', color: '#5a7a5a' };
    }

    render(container) {
        const { score, breakdown } = this.calculate();
        const { label, color } = this.getLabel(score);

        const html = `
      <div class="section">
        <h3 class="section-title">Developer Score</h3>
        <div class="score-card">
          <div class="score-circle">
            <span class="score-number" style="color: ${color}">${score}</span>
            <span class="score-max">/100</span>
          </div>
          <div class="score-details">
            <p class="score-label" style="color: ${color}">${label}</p>
            <div class="score-breakdown">
              ${breakdown.map(item => `
                <div class="breakdown-item">
                  <span class="breakdown-label">${item.label}</span>
                  <div class="breakdown-bar">
                    <div class="breakdown-fill" style="width: ${(item.points / item.max) * 100}%; background: ${color}"></div>
                  </div>
                  <span class="breakdown-points">${item.points}/${item.max}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
        container.insertAdjacentHTML('beforeend', html);
    }
}
export default class ActivityFeed {
    constructor(events) {
        this.events = events.slice(0, 8);
    }

    getEventDescription(event) {
        switch (event.type) {
            case 'PushEvent':
                return `Pushed to <strong>${event.repo.name}</strong>`;
            case 'CreateEvent':
                return `Created ${event.payload.ref_type} <strong>${event.repo.name}</strong>`;
            case 'WatchEvent':
                return `Starred <strong>${event.repo.name}</strong>`;
            case 'ForkEvent':
                return `Forked <strong>${event.repo.name}</strong>`;
            case 'IssuesEvent':
                return `${event.payload.action} issue on <strong>${event.repo.name}</strong>`;
            case 'PullRequestEvent':
                return `${event.payload.action} pull request on <strong>${event.repo.name}</strong>`;
            default:
                return `Activity on <strong>${event.repo.name}</strong>`;
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    render(container) {
        if (!this.events || this.events.length === 0) {
            return;
        }

        const html = `
      <div class="section">
        <h3 class="section-title">Recent Activity</h3>
        <ul class="activity-list">
          ${this.events.map(event => `
            <li class="activity-item">
              <span class="activity-date">${this.formatDate(event.created_at)}</span>
              <span class="activity-desc">${this.getEventDescription(event)}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
        container.insertAdjacentHTML('beforeend', html);
    }
}
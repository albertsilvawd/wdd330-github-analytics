import { loadHeaderFooter, alertMessage, showLoading, saveRecentSearch, getRecentSearches, saveLastSearch, getLastSearch } from './utils.mjs';
import GitHubService from './GitHubService.mjs';
import ProfileDashboard from './ProfileDashboard.mjs';
import ProfileScore from './ProfileScore.mjs';
import RepoList from './RepoList.mjs';
import ActivityFeed from './ActivityFeed.mjs';
import DevToService from './DevToService.mjs';
import ArticleList from './ArticleList.mjs';

loadHeaderFooter();

const github = new GitHubService();
const devto = new DevToService();
const searchBtn = document.getElementById('search-btn');
const usernameInput = document.getElementById('username-input');
const dashboard = document.getElementById('dashboard');

function renderRecentSearches() {
    const searches = getRecentSearches();
    const existing = document.getElementById('recent-searches');
    if (existing) existing.remove();
    if (searches.length === 0) return;

    const container = document.createElement('div');
    container.id = 'recent-searches';
    container.innerHTML = `
    <p class="recent-label">Recent searches:</p>
    <div class="recent-list">
      ${searches.map(s => `<button class="recent-btn" data-username="${s}">${s}</button>`).join('')}
    </div>
  `;

    container.querySelectorAll('.recent-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            usernameInput.value = btn.dataset.username;
            searchProfile(btn.dataset.username);
        });
    });

    const searchContainer = document.querySelector('.search-container');
    searchContainer.insertAdjacentElement('afterend', container);
}

function updateURL(username) {
    const url = new URL(window.location.href);
    url.searchParams.set('user', username);
    window.history.pushState({}, '', url);
}

async function searchProfile(username) {
    if (!username.trim()) {
        alertMessage('Please enter a GitHub username.');
        return;
    }

    dashboard.classList.remove('hidden');
    showLoading(dashboard);

    updateURL(username);
    saveLastSearch(username);
    saveRecentSearch(username);
    renderRecentSearches();

    try {
        const [profile, repos, events] = await Promise.all([
            github.getUserProfile(username),
            github.getRepos(username),
            github.getEvents(username),
        ]);

        dashboard.innerHTML = '';

        const profileDashboard = new ProfileDashboard({ profile, repos });
        profileDashboard.render(dashboard);

        const profileScore = new ProfileScore(profile, repos);
        profileScore.render(dashboard);

        const repoList = new RepoList(repos);
        repoList.render(dashboard);

        const activityFeed = new ActivityFeed(events);
        activityFeed.render(dashboard);

        try {
            const articles = await devto.getArticlesByUsername(username);
            const articleList = new ArticleList(articles);
            articleList.render(dashboard);
        } catch {
            // user may not have a DEV.to account — fail silently
        }

    } catch (err) {
        alertMessage(err.message || 'User not found. Please try again.');
        dashboard.classList.add('hidden');
        const url = new URL(window.location.href);
        url.searchParams.delete('user');
        window.history.pushState({}, '', url);
    }
}

searchBtn.addEventListener('click', () => {
    searchProfile(usernameInput.value.trim());
});

usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchProfile(usernameInput.value.trim());
    }
});

// Load from URL parameter or last search on page load
const urlParams = new URLSearchParams(window.location.search);
const urlUser = urlParams.get('user');
const lastUser = getLastSearch();

if (urlUser) {
    usernameInput.value = urlUser;
    searchProfile(urlUser);
} else if (lastUser) {
    usernameInput.value = lastUser;
}

renderRecentSearches();
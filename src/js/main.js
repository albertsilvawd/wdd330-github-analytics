import { loadHeaderFooter, alertMessage, showLoading } from './utils.mjs';
import GitHubService from './GitHubService.mjs';
import ProfileDashboard from './ProfileDashboard.mjs';
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

async function searchProfile(username) {
    if (!username.trim()) {
        alertMessage('Please enter a GitHub username.');
        return;
    }

    dashboard.classList.remove('hidden');
    showLoading(dashboard);

    try {
        const [profile, repos, events] = await Promise.all([
            github.getUserProfile(username),
            github.getRepos(username),
            github.getEvents(username),
        ]);

        dashboard.innerHTML = '';

        const profileDashboard = new ProfileDashboard({ profile, repos });
        profileDashboard.render(dashboard);

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
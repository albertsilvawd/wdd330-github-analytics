import { loadHeaderFooter, alertMessage, showLoading } from './utils.mjs';
import GitHubService from './GitHubService.mjs';
import ProfileDashboard from './ProfileDashboard.mjs';

loadHeaderFooter();

const github = new GitHubService();
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
        const [profile, repos] = await Promise.all([
            github.getUserProfile(username),
            github.getRepos(username),
        ]);

        const profileDashboard = new ProfileDashboard({ profile, repos });
        profileDashboard.render(dashboard);
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
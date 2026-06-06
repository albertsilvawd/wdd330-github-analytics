const BASE_URL = 'https://api.github.com';

async function convertToJson(res) {
    const json = await res.json();
    if (res.ok) {
        return json;
    } else {
        if (res.status === 403 && json.message && json.message.includes('rate limit')) {
            throw { name: 'RateLimitError', message: 'GitHub API rate limit exceeded. Please wait a few minutes and try again.' };
        }
        if (res.status === 404) {
            throw { name: 'NotFoundError', message: `User not found. Please check the username and try again.` };
        }
        throw { name: 'GitHubError', message: json.message || 'GitHub API error. Please try again.' };
    }
}

export default class GitHubService {
    async getUserProfile(username) {
        const response = await fetch(`${BASE_URL}/users/${username}`);
        return await convertToJson(response);
    }

    async getRepos(username) {
        const response = await fetch(
            `${BASE_URL}/users/${username}/repos?sort=stars&per_page=100`
        );
        return await convertToJson(response);
    }

    async getEvents(username) {
        const response = await fetch(
            `${BASE_URL}/users/${username}/events/public?per_page=30`
        );
        return await convertToJson(response);
    }

    async getRateLimit() {
        const response = await fetch(`${BASE_URL}/rate_limit`);
        return await convertToJson(response);
    }
}
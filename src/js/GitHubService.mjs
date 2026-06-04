const BASE_URL = 'https://api.github.com';

async function convertToJson(res) {
    const json = await res.json();
    if (res.ok) {
        return json;
    } else {
        throw { name: 'GitHubError', message: json.message || 'GitHub API error' };
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
}